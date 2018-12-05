// author: NK

import * as React from 'react';
import { NetInfo, ConnectionInfo } from 'react-native';
import { Client } from 'bugsnag-react-native';
import { BUGSNAG_TOKEN } from '@appConfig';

interface IAppLoaderProps {}

interface IAppLoaderState {
  isOnline: boolean;
}

class AppLoader extends React.PureComponent<IAppLoaderProps, IAppLoaderState> {
  _bugsnag: Client = new Client(BUGSNAG_TOKEN);

  constructor(props: IAppLoaderProps) {
    super(props);
    this.state = {
      isOnline: false
    };

    // this._bugsnag.notify(new Error('Test error #2 with source maps'));
  }

  componentDidMount() {
    // check if User is signed in; if so, assign to BugSnag

    this.setupNetworkListener();
  }

  componentDidUpdate(prevProps: IAppLoaderProps) {
    const justLoggedIn = false;
    const justLoggedOut = false;

    if (justLoggedIn) {
      this._bugsnag.setUser(uid, name, email);
    }

    if (justLoggedOut) {
      this._bugsnag.clearUser();
    }
  }

  componentWillUnmount() {
    NetInfo.removeEventListener(
      'connectionChange',
      this.handleConnectionChange
    );
  }

  private initAppWithUserLoggedIn = (): void => {};

  private setupNetworkListener = async (): Promise<void> => {
    const networkStatus = await NetInfo.getConnectionInfo();

    console.log(`networkStatus:`, networkStatus);
    const isOnline = networkStatus.type !== 'none';

    this.setState({ isOnline });
    NetInfo.addEventListener('connectionChange', this.handleConnectionChange);
  }

  private handleConnectionChange = (
    connectionInfo: ConnectionInfo | string
  ): void => {
    console.log(`connectionInfo:`, connectionInfo);

    const isOnline =
      typeof connectionInfo === 'string'
        ? connectionInfo !== 'none'
        : connectionInfo.type !== 'none';

    this.setState({ isOnline });
  }

  public render() {
    return null;
  }
}

export { AppLoader };
