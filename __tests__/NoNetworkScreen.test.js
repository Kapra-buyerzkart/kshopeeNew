import React from 'react';
import renderer, { act } from 'react-test-renderer';
import NoNetworkFound from '../src/components/NoNetworkFound';
import NoNetworkScreen from '../src/screens/NoNetworkScreen/NoNetworkScreen';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    canGoBack: jest.fn(() => true),
  }),
  useRoute: () => ({
    params: {
      title: 'No Network',
      message: 'Check your connection',
      retryButtonText: 'Retry Connection',
      showHomeButton: true,
    },
  }),
}));

describe('NoNetworkFound & NoNetworkScreen', () => {
  it('renders correctly with default texts matching luxury theme', () => {
    let tree;
    act(() => {
      tree = renderer.create(
        <NoNetworkFound isFullScreen={false} onRetry={() => {}} />,
      );
    });

    const root = tree.root;
    const allText = root.findAllByType('Text').map(t => t.props.children).flat().join(' ');

    expect(allText).toContain('Connection Temporarily Lost');
    expect(allText).toContain('OFFLINE MODE');
    expect(allText).toContain('We are unable to connect to the Kapra network');
    expect(allText).toContain('Retry Connection');
    expect(allText).toContain('Quick Connectivity Tips');
    expect(allText).toContain('Wi-Fi & Cellular Data');
  });

  it('triggers onRetry when Retry Connection button is pressed', async () => {
    const onRetryMock = jest.fn();
    let tree;
    act(() => {
      tree = renderer.create(
        <NoNetworkFound onRetry={onRetryMock} isFullScreen={false} />,
      );
    });

    const pressables = tree.root.findAll(node => typeof node.props?.onPress === 'function');
    const retryBtn = pressables.find(node => {
      const texts = node.findAllByType('Text').map(t => t.props.children);
      return texts.includes('Retry Connection');
    });

    expect(retryBtn).toBeDefined();
    await act(async () => {
      retryBtn.props.onPress();
    });

    expect(onRetryMock).toHaveBeenCalledTimes(1);
  });

  it('renders NoNetworkScreen properly', () => {
    let tree;
    act(() => {
      tree = renderer.create(<NoNetworkScreen />);
    });

    const root = tree.root;
    const allText = root.findAllByType('Text').map(t => t.props.children).flat().join(' ');
    expect(allText).toContain('No Network');
    expect(allText).toContain('Check your connection');
    expect(allText).toContain('Return to Home');
  });
});
