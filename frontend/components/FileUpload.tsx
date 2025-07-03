
import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { UploadedFile } from '../types';
import { UploadCloudIcon } from './icons/UploadCloudIcon';
import { FileTextIcon } from './icons/FileTextIcon';
import { WandIcon } from './icons/WandIcon';

interface FileUploadProps {
  onProcess: (projectName: string, files: UploadedFile[]) => Promise<void>;
  isLoading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onProcess, isLoading }) => {
  const [projectName, setProjectName] = useState<string>('');
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const fileCounter = useRef(0);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        multiple: true,
      });

      if (!result.canceled) {
        const newFiles: UploadedFile[] = result.assets.map(asset => ({
          id: `file-${fileCounter.current++}-${asset.name}`,
          file: {
            name: asset.name,
            uri: asset.uri,
            mimeType: asset.mimeType,
            size: asset.size,
          },
        }));
        setFiles(prevFiles => [...prevFiles, ...newFiles]);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const removeFile = (id: string) => {
    setFiles(files.filter(f => f.id !== id));
  };
  
  const handleProcessClick = () => {
      if (projectName && files.length > 0) {
          onProcess(projectName, files);
      }
  };

  const isButtonDisabled = !projectName || files.length === 0 || isLoading;

  return (
    <View className="space-y-8">
      <View>
        <Text className="block text-sm font-inter-medium leading-6 text-gray-300 mb-2">
          Project Name
        </Text>
        <TextInput
          value={projectName}
          onChangeText={setProjectName}
          placeholder="e.g., My Awesome Tutorial"
          placeholderTextColor="#64748b"
          className="w-full rounded-md border border-white/10 bg-white/5 py-3 px-3 text-white shadow-sm sm:text-sm"
        />
      </View>

      <View>
        <Text className="block text-sm font-inter-medium leading-6 text-gray-300 mb-2">Upload Files</Text>
        <TouchableOpacity onPress={pickDocument} className="mt-2 flex justify-center items-center rounded-lg border border-dashed border-gray-700 px-6 py-10 transition-colors duration-200">
          <View className="text-center items-center">
            <UploadCloudIcon width={48} height={48} color="#64748b" />
            <Text className="mt-4 text-sm leading-6 text-gray-400">Tap to select files</Text>
            <Text className="text-xs leading-5 text-gray-500">Any file type</Text>
          </View>
        </TouchableOpacity>
      </View>

      {files.length > 0 && (
        <View>
          <Text className="text-base font-inter-semibold leading-6 text-gray-200">Uploaded Files</Text>
          <View className="mt-4 border-y border-gray-800">
            {files.map(({ id, file }) => (
              <View key={id} className="flex-row items-center justify-between py-3 border-b border-gray-800">
                <View className="flex-row items-center gap-3 flex-1">
                  <FileTextIcon width={24} height={24} color="#64748b" />
                  <Text className="text-sm font-inter-medium text-gray-300" numberOfLines={1}>{file.name}</Text>
                </View>
                <TouchableOpacity onPress={() => removeFile(id)}>
                  <Text className="text-xs text-red-400 hover:text-red-300 font-inter-semibold">Remove</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      )}

      <View className="flex items-end">
        <TouchableOpacity
          onPress={handleProcessClick}
          disabled={isButtonDisabled}
          className={`flex-row items-center gap-x-2 rounded-md bg-indigo-600 px-4 py-3 text-sm font-inter-semibold text-white shadow-sm ${isButtonDisabled ? 'opacity-50' : 'opacity-100'}`}
        >
          {isLoading ? (
            <>
              <ActivityIndicator color="#fff" className="mr-2" />
              <Text className="text-white font-inter-semibold">Processing...</Text>
            </>
          ) : (
            <>
              <WandIcon width={20} height={20} color="#fff" />
              <Text className="text-white font-inter-semibold">Process & Generate Script</Text>
            </>
          )}
        </TouchableOpacity>
      </div>
    </View>
  );
};

export default FileUpload;
