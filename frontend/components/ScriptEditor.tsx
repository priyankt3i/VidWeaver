
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import { Script, Project } from '../types';
import { ClapperboardIcon } from './icons/ClapperboardIcon';
import { WandIcon } from './icons/WandIcon';
import Button from './ui/Button';

interface ScriptEditorProps {
  initialScript: Script;
  project: Project;
  onGenerateVideo: (script: Script) => Promise<void>;
  onRegenerate: () => Promise<void>;
  isLoading: boolean;
}

const ScriptEditor: React.FC<ScriptEditorProps> = ({ initialScript, project, onGenerateVideo, onRegenerate, isLoading }) => {
  const [scriptContent, setScriptContent] = useState(initialScript.raw);

  useEffect(() => {
    setScriptContent(initialScript.raw);
  }, [initialScript]);

  const handleGenerateVideoClick = () => {
    const updatedScript: Script = { ...initialScript, raw: scriptContent };
    onGenerateVideo(updatedScript);
  };
  
  return (
    <View className="space-y-6">
       <View>
        <Text className="text-2xl font-inter-bold tracking-tight text-white sm:text-3xl">
          Your AI-Generated Script
        </Text>
        <Text className="mt-2 text-lg leading-8 text-gray-400 font-inter-regular">
            Detected type: <Text className="font-inter-semibold text-indigo-400">{project.contentType}</Text>. Review and edit the script below.
        </Text>
      </View>

      <View>
        <Text className="block text-sm font-inter-medium leading-6 text-gray-300 mb-2">
          Script
        </Text>
        <TextInput
          multiline
          scrollEnabled
          textAlignVertical="top"
          value={scriptContent}
          onChangeText={setScriptContent}
          editable={!isLoading}
          className="h-64 w-full rounded-md border border-white/10 bg-white/5 py-3 px-4 text-gray-300 shadow-sm sm:text-sm"
        />
      </View>
      
      <View className="flex-col sm:flex-row justify-end gap-4">
          <View className="mb-4 sm:mb-0">
            <Button
              onPress={onRegenerate}
              isLoading={isLoading}
              loadingText="Please wait..."
              variant="secondary"
              Icon={WandIcon}
            >
              Regenerate Script
            </Button>
          </View>
          <Button
            onPress={handleGenerateVideoClick}
            isLoading={isLoading}
            loadingText="Generating..."
            Icon={ClapperboardIcon}
          >
            Generate Video
          </Button>
      </View>
    </View>
  );
};

export default ScriptEditor;
