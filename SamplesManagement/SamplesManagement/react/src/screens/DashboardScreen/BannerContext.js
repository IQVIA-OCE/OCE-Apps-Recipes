import React from 'react';
import { View } from 'react-native';
import { Banner } from '@oce-apps/apollo-react-native';
import { useBanner } from '../../hooks';

export const BannerContext = React.createContext([{}, (data) => {}]);

export default ({ children }) => {
  const [banner, setBanner] = useBanner();
  return (
    <View style={{ flex: 1 }}>
      <Banner
        variant={banner.variant}
        icon={banner.icon}
        visible={banner.visible}
      >
        {banner.message}
      </Banner>
      <BannerContext.Provider value={[banner, setBanner]}>
        {children}
      </BannerContext.Provider>
    </View>
  );
};
