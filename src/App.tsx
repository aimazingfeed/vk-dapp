import { useEffect, useState } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { AdaptivityProvider, AppRoot, ConfigProvider, SplitCol, SplitLayout, View } from '@vkontakte/vkui';
import { WalletConnectContext } from 'services';
import { camelize } from 'utils';

import Home from './panels/Home';
import Persik from './panels/Persik';

import '@vkontakte/vkui/dist/vkui.css';

const App = () => {
  const [activePanel, setActivePanel] = useState('home');
  const [fetchedUser, setUser] = useState(null);
  // const [popout, setPopout] = useState(<ScreenSpinner size="large" />);
  useEffect(() => {
    let canceled = false;
    async function fetchData() {
      const user = await bridge.send('VKWebAppGetUserInfo');
      if (canceled) return;
      setUser(camelize(user));
      // setPopout(null);
    }
    fetchData();
    return () => {
      canceled = true;
    };
  }, []);

  const go = (e) => {
    setActivePanel(e.currentTarget.dataset.to);
  };
  return (
    <ConfigProvider>
      <AdaptivityProvider>
        <WalletConnectContext>
          <AppRoot>
            <SplitLayout>
              <SplitCol>
                <View activePanel={activePanel}>
                  <Home id="home" fetchedUser={fetchedUser} />
                  <Persik id="persik" go={go} />
                </View>
              </SplitCol>
            </SplitLayout>
          </AppRoot>
        </WalletConnectContext>
      </AdaptivityProvider>
    </ConfigProvider>
  );
};

export default App;
