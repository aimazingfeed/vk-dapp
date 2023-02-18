import { useState } from 'react';
import { AdaptivityProvider, AppRoot, ConfigProvider, SplitCol, SplitLayout, View } from '@vkontakte/vkui';
import { Layout, NotificationsModal, NotificationsModalContext } from 'containers';
import { WalletConnectContext } from 'services';

import { Authorization, Home } from './panels';

import '@vkontakte/vkui/dist/vkui.css';
import './styles/styles.scss';

const App = () => {
  const [activePanel, setActivePanel] = useState('authorization');

  return (
    <ConfigProvider>
      <AdaptivityProvider>
        <NotificationsModalContext>
          <WalletConnectContext>
            <AppRoot>
              <SplitLayout modal={<NotificationsModal />}>
                <SplitCol>
                  <Layout setActivePanel={setActivePanel}>
                    <View activePanel={activePanel}>
                      <Authorization id="authorization" />
                      <Home id="home" />
                    </View>
                  </Layout>
                </SplitCol>
              </SplitLayout>
            </AppRoot>
          </WalletConnectContext>
        </NotificationsModalContext>
      </AdaptivityProvider>
    </ConfigProvider>
  );
};

export default App;
