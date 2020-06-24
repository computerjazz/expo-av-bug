import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useExpoAv, RecordingState } from './components/useAudioRecordingApi';

export default function AudioRecorderScreen() {
  const [recState, setRecState] = useState(RecordingState.STOPPED)

  const audioRecordingApi = useExpoAv()

  const isRecording = recState === RecordingState.RECORDING
  const isPaused = recState === RecordingState.PAUSED
  const isStopped = recState === RecordingState.STOPPED

  const onStartRecord = async () => {
    const result = await audioRecordingApi.startRecording()
    if (result) setRecState(result.state)
  };

  const onPauseRecord = async () => {
    const result = await audioRecordingApi.pauseRecording()
    if (result) setRecState(result.state)
  };

  const onStopRecord = async () => {
    const result = await audioRecordingApi.stopRecording()
    if (result) {
      setRecState(result.state)
    }
  };

  return (
    <SafeAreaView style={styles.flex}>
      <View style={styles.container}>
      <Text>{recState}</Text>
          {!isRecording && <Button text="rec" color="red" onPress={onStartRecord} />}
          {!isPaused && !isStopped && <Button color="gray" text="pause rec" onPress={onPauseRecord} />}
          {(isRecording || isPaused) && <Button color="black" key="stop" text="stop rec" onPress={onStopRecord} />}
        </View>
    </SafeAreaView>
  );
}

const Button = ({ onPress, text, color = 'gray' }: { onPress: () => void, text: string, color?: string }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.button, { backgroundColor: color }]}>
    <Text style={styles.buttonText}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 40,
  },
  buttonContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#eee'
  },
  vizContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'space-around',
    margin: 10,
  },
  button: {
    padding: 10,
    margin: 5,
    borderRadius: 3
  },
  buttonText: {
    color: 'white'
  }
})
