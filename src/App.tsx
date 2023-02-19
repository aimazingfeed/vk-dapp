import { useState } from 'react';
import {
  AdaptivityProvider,
  AppRoot,
  ConfigProvider,
  ScreenSpinner,
  SplitCol,
  SplitLayout,
  View,
} from '@vkontakte/vkui';
import { Layout, NotificationsModal, NotificationsModalContext } from 'containers';
import { Authorization, Home, MintNft } from 'panels';
import { WalletConnectContext } from 'services';

import '@vkontakte/vkui/dist/vkui.css';
import './styles/styles.scss';

const App = () => {
  const [activePanel, setActivePanel] = useState('authorization');
  const [isCommonLoader, setIsCommonLoader] = useState(false);
  return (
    <ConfigProvider>
      <AdaptivityProvider>
        <NotificationsModalContext>
          <WalletConnectContext>
            <AppRoot>
              <SplitLayout
                modal={<NotificationsModal setIsCommonLoader={setIsCommonLoader} />}
                popout={isCommonLoader && <ScreenSpinner state="loading" />}
              >
                <SplitCol>
                  <Layout setActivePanel={setActivePanel}>
                    <View activePanel={activePanel}>
                      <Home id="home" setActivePanel={setActivePanel} setIsCommonLoader={setIsCommonLoader} />
                      <Authorization id="authorization" />
                      <MintNft id="mint-nft" setActivePanel={setActivePanel} setIsCommonLoader={setIsCommonLoader} />
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
