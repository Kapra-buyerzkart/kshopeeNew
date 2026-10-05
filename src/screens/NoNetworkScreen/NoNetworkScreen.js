import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import NoNetworkFound from '../../components/NoNetworkFound';

const NoNetworkScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const {
    onRetry,
    title,
    message,
    retryButtonText,
    showHomeButton = true,
  } = (route.params || {});

  const handleRetry = async () => {
    if (typeof onRetry === 'function') {
      await onRetry();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const handleGoHome = () => {
    navigation.navigate('MainTab', { screen: 'HomeScreen' });
  };

  return (
    <NoNetworkFound
      title={title}
      message={message}
      retryButtonText={retryButtonText}
      onRetry={handleRetry}
      secondaryButtonText={showHomeButton ? 'Return to Home' : undefined}
      onSecondaryAction={showHomeButton ? handleGoHome : undefined}
      isFullScreen={true}
    />
  );
};

export default NoNetworkScreen;
