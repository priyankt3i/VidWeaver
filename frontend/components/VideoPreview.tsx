
import React from 'react';
import { View, Text, Image, Alert, ScrollView } from 'react-native';
import { Video as ExpoVideo, ResizeMode } from 'expo-av';
import { Video } from '../types';
import { YoutubeIcon } from './icons/YoutubeIcon';
import Button from './ui/Button';
import { RefreshCwIcon } from './icons/RefreshCwIcon';

interface VideoPreviewProps {
  video: Video;
  onStartOver: () => void;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({ video, onStartOver }) => {
  const handlePublish = () => {
    Alert.alert(
      "Publish to YouTube",
      "This would normally initiate YouTube OAuth and upload the video. This feature is not implemented in this demo."
    );
  };

  return (
    <View className="space-y-8">
       <View>
        <Text className="text-2xl font-inter-bold tracking-tight text-white sm:text-3xl">
          Your Video is Ready!
        </Text>
        <Text className="mt-2 text-lg leading-8 text-gray-400 font-inter-regular">
            Preview your final video below.
        </Text>
      </View>

      <View className="lg:flex-row gap-8">
        <View className="lg:flex-2">
            <View className="aspect-video w-full rounded-lg overflow-hidden bg-gray-800 border border-gray-700">
                <ExpoVideo
                    source={{ uri: video.url }}
                    useNativeControls
                    resizeMode={ResizeMode.CONTAIN}
                    className="w-full h-full"
                />
            </View>
        </View>
        <View className="lg:flex-1 space-y-6 mt-8 lg:mt-0">
            <View>
                <Text className="text-base font-inter-semibold text-gray-200">Generated Thumbnail</Text>
                <Image source={{ uri: video.thumbnailUrl }} className="mt-2 rounded-lg aspect-video w-full border border-gray-700"/>
            </View>
             <View>
                <Text className="text-base font-inter-semibold text-gray-200">Suggested Tags</Text>
                <View className="mt-2 flex-row flex-wrap gap-2">
                    {video.tags.map(tag => (
                        <View key={tag} className="rounded-md bg-gray-800 px-2 py-1 ring-1 ring-gray-700">
                          <Text className="text-xs font-inter-medium text-gray-300">{tag}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
      </View>

      <View className="flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-800">
          <View className="mb-4 sm:mb-0">
            <Button
              onPress={onStartOver}
              variant="secondary"
              Icon={RefreshCwIcon}
            >
              Create New Video
            </Button>
          </View>
          <Button
            onPress={handlePublish}
            variant="danger"
            Icon={YoutubeIcon}
          >
            Publish to YouTube
          </Button>
      </View>
    </View>
  );
};

export default VideoPreview;
