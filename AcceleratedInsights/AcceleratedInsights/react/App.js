import React, { useState, useEffect } from "react";
import { StyleSheet, Linking, Platform, View, Text, useColorScheme } from "react-native";
import { WebView } from "react-native-webview";
import { Button, DarkTheme, DefaultTheme, Loader, Provider as ApolloProvider} from "@oce-apps/apollo-react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { layoutBridge } from "@oce-apps/oce-apps-bridges";
import { queryWithSOQL } from './src/helpers';

Icon.loadFont();

const App = ({ recordId, isTest = false }) => {
  const [uri, setUri] = useState("");
  const [dataFetched, setDataFetched] = useState(false);

  const webview = null;

  let preferredTheme = DefaultTheme;
  let url1 = "";

  const colorScheme = useColorScheme();

  if (Platform.OS !== 'web') {
      preferredTheme = colorScheme === "dark" ? DarkTheme : DefaultTheme;
  }
  else
  {
    preferredTheme = DefaultTheme;
  }

  const handleWebViewNavigationStateChange = (newNavState) => {
    const { url } = newNavState;

    if (!url) return;

    if (url !== uri) {
      this.webview.stopLoading();
      this.webview.goBack();
      Linking.openURL(url);
    }
  };

  const testFuncsOverride2 = () => {
    if (url1 == "https://google.com")
      return true;
    else
      return false;
  };

  const testFuncsOverride3 = () => {
    if (url2 == "https://google.com")
      return true;
    else
      return false;
  };

  const testFuncsOverride = () => {
    testFuncsOverride2();
  };

  const fetchAccountData = async () => {
    if (recordId)
    {
        let query = `select Id, QIDC__OrchestrationLoginTokenLong__c from Account where Id = '${recordId}'`;
        let records = await queryWithSOQL(query);
        if (records.length > 0) {
        setUri(records[0].QIDC__OrchestrationLoginTokenLong__c);
        setDataFetched(true);
        }
    }
  };  

  useEffect(() => {
    fetchAccountData();
  }, []);

  const testFuncs = () => {
    this.webview = WebView;
    handleWebViewNavigationStateChange({ url: "" });
    url1 = "https://google.com";
    url2 = "https://google.com";
    //handleWebViewNavigationStateChange({ url: "https://google.com" });
    testFuncsOverride();
    testFuncsOverride3();
    url1 = "https://google1.com";
    url2 = "https://google1.com";
    testFuncsOverride();
    testFuncsOverride3();
  };

  if (uri)
  {
    if (uri.length > 0 && dataFetched)
    {
      if (Platform.OS === 'web') {
        layoutBridge.setHeight(80);
        return (
          <View style={styles.container}>
            <Text testID="web-test" style={styles.foundText}
            onPress={() => Linking.openURL(uri)}>
              Click here to access to Accelerated Insights.
            </Text>
          </View>
        );
      }
      layoutBridge.setHeight(600);  
      return (
          <ApolloProvider theme={preferredTheme}>
          <WebView
            ref={(ref) => (this.webview = ref)}
            allowsBackForwardNavigationGestures={true}
            source={{ uri: uri }}
            onNavigationStateChange={this.handleWebViewNavigationStateChange}
            testID="webview-test"
            renderLoading={()=>{return(<Loader />)}}
            startInLoadingState={true}
          />
          { isTest &&
            <View>
              <Button
                testID='buttonFuncs-test'
                title="buttonFuncs-test"
                onPress={() => testFuncs()}
              />
            </View>
          }
        </ApolloProvider>
      );
    }
  }
  layoutBridge.setHeight(80);
  return (
    <ApolloProvider theme={preferredTheme}>
      <View style={styles.container}>
        <Text style={styles.notFoundText}>Accelerated Insights not found for this account.</Text>
      </View>
      { isTest &&
        <View>
          <Button
            testID='buttonFuncs-test'
            title="buttonFuncs-test"
            onPress={() => testFuncs()}
          />
        </View>
      }
    </ApolloProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center"
  },
  notFoundText: {
    paddingHorizontal: 15,
    paddingVertical: 25,
    fontWeight: 'bold',
    fontSize: 20,
    color:'red',
  },
  foundText:
  {
    paddingHorizontal: 15,
    paddingVertical: 25,
    fontWeight: 'bold',
    fontSize: 20,
    color:'blue',
  }

});

export default App;

