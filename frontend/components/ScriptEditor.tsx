
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
  const [intro, setIntro] = useState(initialScript.intro);
  const [mainContent, setMainContent] = useState(initialScript.mainContent);
  const [summary, setSummary] = useState(initialScript.summary);
  const [cta, setCta] = useState(initialScript.cta);

  useEffect(() => {
    setIntro(initialScript.intro);
    setMainContent(initialScript.mainContent);
    setSummary(initialScript.summary);
    setCta(initialScript.cta);
  }, [initialScript]);

  const handleGenerateVideoClick = () => {
    const updatedScript: Script = {
      ...initialScript,
      intro,
      mainContent,
      summary,
      cta,
      raw: [intro, mainContent, summary, cta].join('\n\n'),
    };
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

      <ScrollView className="space-y-6">
        <ScriptSection title="1. Intro" value={intro} onChange={setIntro} placeholder="A hook to grab the viewer's attention..." isLoading={isLoading} />
        <ScriptSection title="2. Main Content" value={mainContent} onChange={setMainContent} placeholder="The core message of the video..." isLoading={isLoading} height={192} />
        <ScriptSection title="3. Summary" value={summary} onChange={setSummary} placeholder="A brief recap of the key points..." isLoading={isLoading} />
        <ScriptSection title="4. Call to Action (CTA)" value={cta} onChange={setCta} placeholder="e.g., 'Like, comment, and subscribe!'" isLoading={isLoading} />
      </ScrollView>
      
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

interface ScriptSectionProps {
  title: string;
  value: string;
  onChange: (text: string) => void;
  placeholder: string;
  isLoading: boolean;
  height?: number;
}

const ScriptSection: React.FC<ScriptSectionProps> = ({ title, value, onChange, placeholder, isLoading, height = 96 }) => (
  <View>
    <Text className="block text-sm font-inter-medium leading-6 text-gray-300 mb-2">
      {title}
    </Text>
    <TextInput
      multiline
      scrollEnabled
      textAlignVertical="top"
      value={value}
      onChangeText={onChange}
      placeholder={placeholder}
      placeholderTextColor="#64748b"
      editable={!isLoading}
      style={{ height }}
      className="w-full rounded-md border border-white/10 bg-white/5 py-3 px-4 text-gray-300 shadow-sm sm:text-sm"
    />
  </View>
);

export default ScriptEditor;
