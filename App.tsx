import React, {useEffect, useState} from 'react';
import {
  View,
  Button,
  NativeModules,
  Alert,
  Text,
  StyleSheet,
} from 'react-native';

interface PipSupport {
  isSupported: boolean;
  deviceInfo: {
    model: string;
    systemName: string;
    systemVersion: string;
    isSimulator: string;
  };
}

interface PIPManagerInterface {
  checkPiPSupport(): Promise<PipSupport>;
  configurePiP(): Promise<void>;
  startPiP(): Promise<void>;
  stopPiP(): Promise<void>;
}

const {PIPManager} = NativeModules as {PIPManager: PIPManagerInterface};

const App: React.FC = () => {
  const [isConfigured, setIsConfigured] = useState<boolean>(false);
  const [pipSupport, setPipSupport] = useState<PipSupport | null>(null);

  useEffect(() => {
    PIPManager.checkPiPSupport()
      .then((result: PipSupport) => {
        console.log('PiP support:', result);
        setPipSupport(result);
        if (result.isSupported) {
          return PIPManager.configurePiP();
        } else {
          throw new Error('PiP is not supported on this device');
        }
      })
      .then(() => {
        console.log('PiP configured successfully');
        setIsConfigured(true);
      })
      .catch((error: Error) => {
        console.error('PiP setup failed:', error);
        Alert.alert('Error', error.message);
      });
  }, []);

  const startPiP = () => {
    if (!isConfigured) {
      Alert.alert('Error', 'PiP is not configured yet');
      return;
    }
    PIPManager.startPiP()
      .then(() => console.log('PiP started successfully'))
      .catch((error: Error) => {
        console.error('Failed to start PiP:', error);
        Alert.alert('Error', 'Failed to start PiP');
      });
  };

  const stopPiP = () => {
    PIPManager.stopPiP()
      .then(() => console.log('PiP stopped successfully'))
      .catch((error: Error) => {
        console.error('Failed to stop PiP:', error);
        Alert.alert('Error', 'Failed to stop PiP');
      });
  };

  return (
    <View style={styles.container}>
      {pipSupport && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            PiP Support: {pipSupport.isSupported ? 'Yes' : 'No'}
          </Text>
          <Text style={styles.infoText}>
            Device: {pipSupport.deviceInfo.model}
          </Text>
          <Text style={styles.infoText}>
            OS: {pipSupport.deviceInfo.systemName}{' '}
            {pipSupport.deviceInfo.systemVersion}
          </Text>
          <Text style={styles.infoText}>
            Simulator: {pipSupport.deviceInfo.isSimulator}
          </Text>
        </View>
      )}
      <Button title="Start PiP" onPress={startPiP} disabled={!isConfigured} />
      <Button title="Stop PiP" onPress={stopPiP} disabled={!isConfigured} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  infoContainer: {
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  infoText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default App;
