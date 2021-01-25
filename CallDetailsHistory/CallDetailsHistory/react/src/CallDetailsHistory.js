import React, { useEffect, useState, useCallback, useRef } from 'react';
import Header from './components/Header';
import { View, StyleSheet, Text, ScrollView, Keyboard } from 'react-native';
import {
  Menu,
  Grid,
  Select,
  LineChart,
  ApolloProgress,
  Banner,
  IconButton,
  Search
} from 'apollo-react-native';

import api from './utils/api';
import {
  getNormalizedData,
  getNormalizedChartData,
  getFilteredColors,
} from './helpers';
import ProductsMenu from './components/ProductsMenu';
import { isIphone } from '../App';

const PERIOD_OPTIONS = [
  {
    label: isIphone ? '3M' : 'Last 3 Months',
    value: 3,
  },
  {
    label: isIphone ? '6M' : 'Last 6 Months',
    value: 6,
  },
  {
    label: isIphone ? '12M' : 'Last 12 Months',
    value: 12,
  }
];

const CallDetailsHistory = ({ recordId }) => {
  const [isLoading, setLoading] = useState(!!recordId);
  const [errorBanner, setErrorBanner] = useState({
    isVisible: false,
    message: '',
  });
  const timer = useRef(0);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accountsList, setAccountsList] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isListLoading, setListLoading] = useState(false);
  const [data, setData] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [period, setPeriod] = useState({ label: isIphone ? '12M' : 'Last 12 Months', value: 12 });
  const [chart, setChart] = useState({ data: null, colors: [] });

  const getData = useCallback(async () => {
    try {
      const normalizedData = await getNormalizedData(selectedAccount);

      setData(normalizedData);
    } catch (err) {
      setErrorBanner({
        isVisible: true,
        message: err,
      });
    }
  }, [selectedAccount]);

  const fetchAccountsList = value => {
    setSearchValue(value);
    try {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      let accounts;
      if (value.trim()) {
        timer.current = setTimeout(async () => {
          setListLoading(true);
          accounts = await fetchAccounts(value);
          setAccountsList(accounts);
          setListLoading(false);
        }, 400);
      }
    } catch (e) {
      console.warn({ e });
    }
  };

  const fetchAccountById = async id => {
    const [data] = await api.query(
      `SELECT Id, Name FROM Account WHERE Id = '${id}'`
    );

    return data;
  };

  const fetchAccounts = async value => {
    const [data] = await api.query(
      `SELECT Id, Name FROM Account WHERE Name != null AND Name LIKE '%${value}%' ORDER BY FirstName ASC NULLS FIRST`
    );

    return data.map(el => {
      return {
        label: el.Name,
        value: el.Id,
      };
    });
  };

  useEffect(() => {
    setData(null);

    if (selectedAccount) {
      setLoading(true);
      getData();
    }
  }, [selectedAccount]);

  useEffect(() => {
    if (data) {
      setLoading(false);
      setSelectedProducts(data.map(el => el.productId));
      setChart({
        ...chart,
        data: getNormalizedChartData(data, period.value),
      });
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      const filteredProducts = data.filter(el =>
        selectedProducts.includes(el.productId)
      );
      const filteredColors = getFilteredColors(data, filteredProducts);

      setChart({
        data: getNormalizedChartData(filteredProducts, period.value),
        colors: filteredColors,
      });
    }
  }, [selectedProducts, period]);

  useEffect(() => {
    setLoading(false);

    if (errorBanner.isVisible) {
      setTimeout(
        () => setErrorBanner({ ...errorBanner, isVisible: false }),
        4000
      );
    }
  }, [errorBanner.isVisible]);

  useEffect(() => {
    if (recordId) {
      fetchAccountById(recordId)
        .then(account => {
          setSelectedAccount(account.Id);
          setSearchValue(account.Name);
        })
    }
  }, []);

  const getChartContainer = () => {
    if (!selectedAccount) {
      return (
        <View style={styles.textContainer}>
          <Text>No account selected.</Text>
        </View>
      );
    }

    if (!isLoading) {
      if (!data || !chart.data) {
        return (
          <View style={styles.textContainer}>
            <Text>No data available.</Text>
          </View>
        );
      }
    }

    if (chart.data && selectedProducts.length === 0) {
      return (
        <View style={styles.textContainer}>
          <Text>No products selected.</Text>
        </View>
      );
    }

    if (chart.data && chart.data.length > 0) {
      return (
        <View>
          <LineChart
            data={chart.data}
            height={400}
            colorScale={chart.colors}
            tickFormatY={y => (Number.isInteger(y) ? y : '')}
            style={{ axis: { borderWidth: 1 } }}
          />
        </View>
      );
    }
  };

  return (
    <View>
      <Banner
        closeIcon
        visible={errorBanner.isVisible}
        variant={'warning'}
        icon={'alert'}
      >
        {`${errorBanner.message}`}
      </Banner>

      <Header />
      <Grid>
        <Grid.Container spacing={isIphone ? 10 : 15}>
          <Grid.Item size={6}>
            <Menu
              visible={isMenuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <View>
                  <Search
                    label="Account"
                    placeholder="Search Account"
                    onFocus={() => setMenuVisible(true)}
                    onChangeText={fetchAccountsList}
                    value={searchValue}
                  />
                </View>
              }
            >
              {isListLoading && (
                <View style={styles.listLoader}>
                  <ApolloProgress />
                </View>
              )}
              {accountsList.length === 0 && (
                <Text style={{ textAlign: 'center', paddingVertical: 20 }}>
                  No accounts found
                </Text>
              )}
              <ScrollView style={{ maxHeight: 300, width: 300 }} keyboardShouldPersistTaps="always">
                {accountsList.map(el => {
                  return (
                    <Menu.Item key={el.value} onPress={() => {
                      setSelectedAccount(el.value);
                      setSearchValue(el.label);
                      setMenuVisible(false);
                      Keyboard.dismiss();
                    }}>
                      <Text>{el.label}</Text>
                    </Menu.Item>
                  );
                })}
              </ScrollView>
            </Menu>
          </Grid.Item>
          <Grid.Item size={isIphone ? 4 : 6}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Select
                label="Period:"
                disabled={selectedAccount === null || data === null}
                canDeselect={false}
                options={PERIOD_OPTIONS}
                value={period}
                style={{ width: isIphone ? '75%' : '80%', marginRight: 10 }}
                onChange={value => setPeriod(value)}
              />
              <View>
                <IconButton
                  disabled={selectedAccount === null}
                  icon="refresh"
                  size={30}
                  style={{ width: 30, height: 30, marginTop: 30 }}
                  onPress={() => {
                    setLoading(true);
                    getData();
                  }}
                />
              </View>
              <ProductsMenu
                data={data}
                selectedProducts={selectedProducts}
                setSelectedProducts={setSelectedProducts}
                setLoading={setLoading}
              />
            </View>
          </Grid.Item>
        </Grid.Container>

        <View>
          {isLoading && (
            <View style={styles.preloader}>
              <ApolloProgress />
            </View>
          )}
          <View style={{ height: 400 }}>{getChartContainer()}</View>
        </View>
      </Grid>
    </View>
  );
};

const styles = StyleSheet.create({
  preloader: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 10,
  },
  listLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 2,
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 400,
  },
  search: {
    width: 265,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
});

export default CallDetailsHistory;
