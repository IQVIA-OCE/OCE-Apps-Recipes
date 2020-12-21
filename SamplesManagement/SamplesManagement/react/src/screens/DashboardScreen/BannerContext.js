import React from 'react';
import { View } from 'react-native';
import { Banner } from 'apollo-react-native';
import { useBanner } from '../../hooks';

export const BannerContext = React.createContext([{}, (data) => {}]);

export default ({ children }) => {
  const [banner, setBanner] = useBanner();
  return (
    <View>
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
