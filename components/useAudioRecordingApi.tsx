
import { useCallback, useRef, useMemo } from 'react'
import { Audio } from 'expo-av'

const expoAvRecordingOptions = {
  android: {
    ...Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY.android,
    extension: '.wav',
    outputFormat: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_DEFAULT,
    sampleRate: 44100,
    numberOfChannels: 1,
  },
  ios: {
    ...Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY.ios,
    extension: '.wav',
    outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_LINEARPCM,
    sampleRate: 44100,
    numberOfChannels: 1,
    bitRateStrategy:
      Audio.RECORDING_OPTION_IOS_BIT_RATE_STRATEGY_CONSTANT,
  },
};

export enum RecordingState {
  STOPPED = "STOPPED",
  PAUSED = "PAUSED",
  RECORDING = "RECORDING"
}

export const useExpoAv = () => {
  const audioRecordingRef = useRef<Audio.Recording | null>(null)

  const startRecording = useCallback(async () => {
    try {
      await Audio.requestPermissionsAsync()
      const status = await audioRecordingRef.current?.getStatusAsync()
      if (!status || status.isDoneRecording) {
        // In the case that the user is beginning recording from a "paused" state
        // we can skip the following initialization steps
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
        })

        audioRecordingRef.current = new Audio.Recording();
        await audioRecordingRef.current.prepareToRecordAsync(expoAvRecordingOptions);
      }
      await audioRecordingRef.current?.startAsync();
      return {
        state: RecordingState.RECORDING
      }
    } catch (error) {
      console.log("EXPO AV: startRecording error", error)
    }
  }, [])

  const pauseRecording = useCallback(async () => {
    try {
      await audioRecordingRef.current?.pauseAsync();
      return {
        state: RecordingState.PAUSED,
      }
    } catch (error) {
      console.log("EXPO AV: pauseRecording error", error)
    }
  }, [])

  const stopRecording = useCallback(async () => {
    try {
      await audioRecordingRef.current?.stopAndUnloadAsync();
      const uri = audioRecordingRef.current?.getURI()
      return {
        state: RecordingState.STOPPED,
        uri,
      }
    } catch (error) {
      console.log("EXPO AV: stopRecording error", error)
    }
  }, [])

  const expoAvApi = useMemo(() => ({
    startRecording,
    pauseRecording,
    stopRecording,
  }), [startRecording, pauseRecording, stopRecording])

  return expoAvApi
}
