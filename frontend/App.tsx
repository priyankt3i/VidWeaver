import React, { useState, useCallback } from 'react';
import { SafeAreaView, ScrollView, View, Text, StatusBar, ActivityIndicator, Alert } from 'react-native';
import { Stage, Project, Script, Video, UploadedFile, ContentType } from './types';
import FileUpload from './components/FileUpload';
import ScriptEditor from './components/ScriptEditor';
import VideoPreview from './components/VideoPreview';
import StepIndicator from './components/StepIndicator';
import { apiService } from './services/api';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold } from '@expo-google-fonts/inter';

export default function App(): React.ReactNode {
  const [stage, setStage] = useState<Stage>(Stage.UPLOAD);
  const [project, setProject] = useState<Project | null>(null);
  const [script, setScript] = useState<Script | null>(null);
  const [video, setVideo] = useState<Video | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold
  });

  const handleFilesProcessed = async (projectName: string, files: UploadedFile[]): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const { contentType, fileSummaries } = await apiService.processDocuments(files);
      const updatedFiles = files.map(f => {
        const summary = fileSummaries.find(s => s.id === f.id);
        return { ...f, summary: summary?.summary };
      });
      const newProject = { name: projectName, files: updatedFiles, contentType };
      setProject(newProject);
      
      const generatedScript = await apiService.generateScript(newProject);
      setScript(generatedScript);
      setStage(Stage.SCRIPT);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred';
      setError(`Failed to process documents. Please check your connection and try again. (${errorMessage})`);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScriptRegenerate = useCallback(async (): Promise<void> => {
    if (!project) return;
    setIsLoading(true);
    setError(null);
    try {
      const generatedScript = await apiService.generateScript(project);
      setScript(generatedScript);
    } catch (e) {
      setError('Failed to regenerate script. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [project]);
  
  const handleVideoGenerated = async (finalScript: Script): Promise<void> => {
    if (!project) return;
    setIsLoading(true);
    setError(null);
    setScript(finalScript);
    try {
      const generatedVideo = await apiService.generateVideo(finalScript, project.contentType);
      setVideo(generatedVideo);
      setStage(Stage.VIDEO);
    } catch (e) {
      setError('Failed to generate video. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartOver = (): void => {
    setStage(Stage.UPLOAD);
    setProject(null);
    setScript(null);
    setVideo(null);
    setError(null);
    setIsLoading(false);
  };

  const renderStage = (): React.ReactNode => {
    switch (stage) {
      case Stage.UPLOAD:
        return <FileUpload onProcess={handleFilesProcessed} isLoading={isLoading} />;
      case Stage.SCRIPT:
        return project && script && <ScriptEditor initialScript={script} project={project} onGenerateVideo={handleVideoGenerated} onRegenerate={handleScriptRegenerate} isLoading={isLoading} />;
      case Stage.VIDEO:
        return video && <VideoPreview video={video} onStartOver={handleStartOver} />;
      default:
        return <FileUpload onProcess={handleFilesProcessed} isLoading={isLoading} />;
    }
  };
  
  if (!fontsLoaded) {
    return <View className="flex-1 items-center justify-center bg-gray-950"><ActivityIndicator size="large" color="#818cf8" /></View>;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-950">
      <StatusBar barStyle="light-content" />
      <ScrollView>
        <View className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
          <View className="items-center mb-8">
            <View className="flex-row items-center justify-center gap-3 mb-2">
              <SparklesIcon width={32} height={32} color="#818cf8" />
              <Text className="text-4xl font-inter-extrabold text-indigo-400">AI Video Producer</Text>
            </View>
            <Text className="text-gray-400 text-lg font-inter-regular text-center">Turn your documents into engaging YouTube videos in minutes.</Text>
          </View>

          <View className="w-full">
            <StepIndicator currentStage={stage} />
            {error && (
              <View className="bg-red-900/50 border border-red-700 rounded-lg p-4 my-4">
                <Text className="text-red-200 font-inter-bold">Error: <Text className="font-inter-regular">{error}</Text></Text>
              </View>
            )}
            <View className="mt-8 bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              {renderStage()}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}