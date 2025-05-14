import React, { useEffect, useState, useReducer } from 'react';
import { useColorScheme, Platform, RefreshControl, StyleSheet, ScrollView, View } from 'react-native';
import { Card, Button, DarkTheme, DefaultTheme, Loader, Modal, Menu, Portal, Provider as ApolloProvider } from '@oce-apps/apollo-react-native';
import { databaseManager, layoutBridge } from '@oce-apps/oce-apps-bridges';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TableCallToDos } from './src/components/TableCallToDos';
import { TableCallBusinessToDos } from './src/components/TableCallBusinessToDos';
import { SearchToDo } from './src/components/SearchToDo';
import { SearchBusinessToDo } from './src/components/SearchBusinessToDo';
import { userId, queryWithSOQL } from './src/utils/helpers';
import { getPermissionsByWorkflow } from './src/utils/workflowHelper';
import { TodoContext } from './src/utils/context';

Icon.loadFont();

export const initialState = {
  toDoData: [],
  businessToDoData: [],
  updateCallToDoData: [],
  updateCallBusinessToDoData: [],
  deleteCallToDoData: [],
  recordId: "",
  accountName: "",
  userFullName: "",
  filterTodo: "",
  filterBusinessTodo: "",
  searchTodo: false,
  searchBusinessTodo: false,
  setDefaultFiltersToDo: false,
  setDefaultFiltersBusinessToDo: false,
  productsDetailed: [],
  attendees: [],
  permissions: []
};

export const dataReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_DO":
      let tempArray = state.toDoData;
      const newArray = tempArray.concat(action.payload);
      return { ...state, toDoData: newArray };
    case "ADD_BUSINESS_TO_DO":
      let tempArray2 = state.businessToDoData;
      const newArray2 = tempArray2.concat(action.payload);
      return { ...state, businessToDoData: newArray2 };
    case "TO_DO":
      return { ...state, toDoData: action.payload };
    case "BUSINESS_TO_DO":
      return { ...state, businessToDoData: action.payload };
    case "UPDATE_CALL_TO_DO":
      return { ...state, updateCallToDoData: action.payload };
    case "UPDATE_CALL_BUSINESS_TO_DO":
      return { ...state, updateCallBusinessToDoData: action.payload };
    case "DELETE_CALL_TO_DO":
      return { ...state, deleteCallToDoData: action.payload };
    case "DELETE_CALL_BUSINESS_TO_DO":
      return { ...state, deleteCallToDoData: action.payload };
    case "SET_RECORD_ID":
      return { ...state, recordId: action.payload };
    case "SET_ACCOUNT_NAME":
      return { ...state, accountName: action.payload };
    case "SET_USER_FULL_NAME":
      return { ...state, userFullName: action.payload };
    case "FILTER_TO_DO":
      return { ...state, filterTodo: action.payload };
    case "SEARCH_TO_DO":
      return { ...state, searchTodo: action.payload };
    case "SET_DEFAULT_FILTER_TO_DO":
      return { ...state, setDefaultFiltersToDo: action.payload };
    case "FILTER_BUSINESS_TO_DO":
      return { ...state, filterBusinessTodo: action.payload };
    case "SEARCH_BUSINESS_TO_DO":
      return { ...state, searchBusinessTodo: action.payload };
    case "SET_DEFAULT_FILTER_BUSINESS_TO_DO":
      return { ...state, setDefaultFiltersBusinessToDo: action.payload };
    case "SET_PRODUCT_DETAILED":
      return { ...state, productsDetailed: action.payload };
    case "SET_ATTENDEES":
      return { ...state, attendees: action.payload };
    case "SET_WKF_PERMISSIONS":
      return { ...state, permissions: action.payload };
  }
};

const App = (props) => {
  
  const { instanceId, recordId, showCallToDoProp = true, showCallBusinessToDoProp = false, isTest = false } = props;
  initialState.recordId = recordId;
  const [state, dispatch] = useReducer(dataReducer, initialState);
  const [custom, setCustom] = useState(false);
  const [saveToDos, setSaveToDos] = useState(false);
  const [saveBusinessToDos, setSaveBusinessToDos] = useState(false);
  const [todoRecordTypeId, setTodoRecordTypeId] = useState("");
  const [businessTodoRecordTypeId, setBusinessTodoRecordTypeId] = useState("");
  const [callRecord, setCallRecord] = useState();
  const [menuVisible, setMenuVisible] = useState(false);
  const [buttonX, setButtonX] = useState(0);
  const [buttonY, setButtonY] = useState(0);
  const [showCallTodo, setShowCallTodo] = useState(showCallToDoProp);
  const [showCallBusinessTodo, setShowCallBusinessTodo] = useState(showCallBusinessToDoProp);
  const [menuButtonText, setMenuButtonText] = useState("Call To Dos");
  const curentUserId = userId();
  const [refreshing, setRefreshing] = useState(false);
  

  let preferredTheme = DefaultTheme;
  const colorScheme = useColorScheme();

  if (Platform.OS !== 'web') {
    preferredTheme = colorScheme === "dark" ? DarkTheme : DefaultTheme;
  }
  if (instanceId) {
    layoutBridge.setHeight(600);
  }

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, [refreshing]); 
 
  const fetchAccountNameData = async () => {
    let query = `SELECT Id, OCE__Account__c, OCE__Channel__c, OCE__ParentCall__c, OCE__SignatureDate__c, OCE__PhysicalForm__c, OCE__Account__r.Name, OCE__CallDateTime__c, OCE__Status__c, OCE__Territory__c, OwnerId, OCE__IsOwner__c from OCE__Call__c where Id = '${recordId}'`;
    let records = await queryWithSOQL(query);
    if (records.length > 0) {
      records.forEach((node) => {
        node.AccountName = (node['OCE__Account__r.Name'] ? node['OCE__Account__r.Name'] : node['OCE__Account__r'] ? node['OCE__Account__r']['Name'] : null);
      });
      setCallRecord(records[0]);
      dispatch({
        type: "SET_ACCOUNT_NAME",
        payload: records[0].AccountName,
      });
    }
  };

  const fetchCallDetailData = async () => {
    let query = `SELECT id, OCE__Product__r.Name from OCE__CallDetail__c where OCE__Call__c = '${recordId}'`;
    let records = await queryWithSOQL(query);
    if (records.length > 0) {
      let productsInCallDetail = [];
      records.forEach((node) => {
        node.ProductName = (node['OCE__Product__r.Name'] ? node['OCE__Product__r.Name'] : node['OCE__Product__r'] ? node['OCE__Product__r']['Name'] : null);
        productsInCallDetail = [...productsInCallDetail, node.ProductName];
      });
      dispatch({
        type: "SET_PRODUCT_DETAILED",
        payload: productsInCallDetail,
      });
    }
  };

  const fetchCallAttendeesData = async () => {
    let query = `SELECT id, OCE__Account__r.Name from OCE__Call__c where OCE__ParentCall__c = '${recordId}'`;
    let records = await queryWithSOQL(query);
    if (records.length > 0) {
      let attendeesInCall = [];
      records.forEach((node) => {
        node.AttendeeName = (node['OCE__Account__r.Name'] ? node['OCE__Account__r.Name'] : node['OCE__Account__r'] ? node['OCE__Account__r']['Name'] : null);
        attendeesInCall = [...attendeesInCall, node.AttendeeName];
      });
      dispatch({
        type: "SET_ATTENDEES",
        payload: attendeesInCall,
      });
    }
  };

  const fetchUserNameData = async () => {
    let query = `select Id, Name from User where Id = '${curentUserId}'`;
    let records = await queryWithSOQL(query);
    if (records.length > 0) {
      dispatch({
        type: "SET_USER_FULL_NAME",
        payload: records[0].Name,
      });
    }
  };

  const fetchRecordTypes = async () => {
    let query = `select Id, Name from recordtype where SobjectType = 'OCE__CallToDo__c' and name in ('Call To-Do','Call Business To-Do')`;
    let records = await queryWithSOQL(query);
    if (records.length > 0) {
      records.forEach((node) => {
        if (node.Name == "Call To-Do")
        {
          setTodoRecordTypeId(node.Id);
        }
        if (node.Name == "Call Business To-Do")
        {
          setBusinessTodoRecordTypeId(node.Id);
        }
      });
    }
  };

  const getPermissions = async () => {
    let perm = await getPermissionsByWorkflow(callRecord, 'OCE__Call__c', 'OCE__CallToDo__c', []);
    dispatch({
      type: "SET_WKF_PERMISSIONS",
      payload: perm,
    });
  };

  useEffect(() => {
    if (state.accountName.length == 0) {
      dispatch({
        type: "SET_RECORD_ID",
        payload: recordId,
      });
      fetchAccountNameData();
    }
    if (state.userFullName.length == 0) {
      fetchUserNameData();
    }
    if (todoRecordTypeId.length == 0 || businessTodoRecordTypeId.length == 0) {
      fetchRecordTypes();
    }
    fetchCallDetailData();
    fetchCallAttendeesData();
  }, []);

  useEffect(() => {
    if (callRecord && state.permissions.length == 0) {
      getPermissions();
    }
  }, [callRecord]);

  useEffect(() => {
    if (state.updateCallToDoData.length > 0) {
      updateToDosInDB(state.updateCallToDoData, "UPDATE_CALL_TO_DO");
      dispatch({
        type: "UPDATE_CALL_TO_DO",
        payload: [],
      });
    }
    if (state.updateCallBusinessToDoData.length > 0) {
      updateToDosInDB(state.updateCallBusinessToDoData, "UPDATE_CALL_BUSINESS_TO_DO");
      dispatch({
        type: "UPDATE_CALL_BUSINESS_TO_DO",
        payload: [],
      });
    }
    if (state.deleteCallToDoData.length > 0) {
      deleteToDosInDB(state.deleteCallToDoData);
      dispatch({
        type: "DELETE_CALL_TO_DO",
        payload: [],
      });
    }
  }, [state]);

  const saveToDosInDB = async (data, action, rcdTypeId) => {
    let fields = [];
    if (action == "TO_DO") {
      data.forEach((node) => {
        let record = [
          {
            sObject: "OCE__CallToDo__c",
            recordtypeid: rcdTypeId,
            OCE__Call__c: recordId,
            OCE__ToDo__c: node.Id,
            OCE__Status__c: node.OCE__Status__c,
          },
        ];
        const newArray = fields.concat(record);
        fields = newArray;
      });
    }
    if (action == "BUSINESS_TO_DO") {
      data.forEach((node) => {
        let record = [
          {
            sObject: "OCE__CallToDo__c",
            recordtypeid: rcdTypeId,
            OCE__Call__c: recordId,
            OCE__BusinessToDo__c: node.Id,
            OCE__Status__c: node.OCE__Status__c,
          },
        ];
        const newArray = fields.concat(record);
        fields = newArray;
      });
    }
    await databaseManager.upsert(fields);
    onRefresh();
  };

  const deleteToDosInDB = async (data) => {
    let fields = [];
    data.forEach((node) => {
      const newArray = fields.concat(node.Id);
      fields = newArray;
    });
    await databaseManager.delete(fields);
    //onRefresh();
  };

  const updateToDosInDB = async (data, action) => {
    let fields = [];
    data.forEach((node) => {
      let record = [
        {
          id: node.Id,
          OCE__Status__c: node.rowStatus.id,
        },
      ];
      const newArray = fields.concat(record);
      fields = newArray;
    });
    await databaseManager.upsert(fields);
    //onRefresh();
  };

  useEffect(() => {
    if (saveToDos) {
      saveToDosInDB(state.toDoData, "TO_DO", todoRecordTypeId);
      dispatch({
        type: "TO_DO",
        payload: [],
      });
      setSaveToDos(false);
    }
  }, [saveToDos]);
  
  const handleOpenToDo = (val) => {
    fetchAccountNameData();
    fetchCallAttendeesData();
    setCustom(val);
    dispatch({
      type: "SET_DEFAULT_FILTER_TO_DO",
      payload: true,
    });
    dispatch({
      type: "SEARCH_TO_DO",
      payload: true,
    });
  };

  const handleSaveToDo = (val) => {
    dispatch({
      type: "TO_DO",
      payload: state.toDoData,
    });
    setCustom(val);
    setSaveToDos(true);
  };

  const handleCloseToDo = (val) => {
    setCustom(val);
  };

  useEffect(() => {
    if (saveBusinessToDos) {
      saveToDosInDB(
        state.businessToDoData,
        "BUSINESS_TO_DO",
        businessTodoRecordTypeId
      );
      dispatch({
        type: "BUSINESS_TO_DO",
        payload: [],
      });
      setSaveBusinessToDos(false);
    }
  }, [saveBusinessToDos]);

  const handleOpenBusinessToDo = (val) => {
    fetchCallDetailData();
    setCustom(val);
    dispatch({
      type: "SET_DEFAULT_FILTER_BUSINESS_TO_DO",
      payload: true,
    });
    dispatch({
      type: "SEARCH_BUSINESS_TO_DO",
      payload: true,
    });
  };

  const handleSaveBusinessToDo = (val) => {
    dispatch({
      type: "BUSINESS_TO_DO",
      payload: state.businessToDoData,
    });
    setCustom(val);
    setSaveBusinessToDos(true);
  };

  const handleCloseBusinessToDo = (val) => {
    setCustom(val);
  };

  const openMenu = () => setMenuVisible(true);

  const closeMenu = () => setMenuVisible(false);

  const showCallToDos = () => {
    setMenuVisible(false);
    setShowCallTodo(true);
    setShowCallBusinessTodo(false);
    setMenuButtonText("Call To Dos");
  };

  const showCallBusinessToDos = () => {
    setMenuVisible(false);
    setShowCallTodo(false);
    setShowCallBusinessTodo(true);
    setMenuButtonText("Call Business To Dos");
  };

  const buttonHeader = () => {
    return (
      <View>
        <Button
          testID="button-switch-todos"
          mode="contained"
          color="primary"
          onPress={openMenu}
          onLayout={ e => {
            setButtonX(e.nativeEvent.layout.x);
            setButtonY(e.nativeEvent.layout.y);
            }
          }>
          {menuButtonText}
        </Button>
        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={{x: buttonX, y: buttonY}}
        >
          <Menu.Item onPress={() => showCallToDos()} title="Call To Dos" />
          <Menu.Item onPress={() => showCallBusinessToDos()} title="Call Business To Dos" />
        </Menu>
      </View>
    );
  };

  const testFuncs = () => {
    dispatch({ type: 'UPDATE_CALL_TO_DO', payload: [ {id: 1, rowStatus: {label: "New", id: "New"}}] });
    dispatch({ type: 'UPDATE_CALL_BUSINESS_TO_DO', payload: [ {id: 1, rowStatus: {label: "New", id: "New"}}] });
    dispatch({ type: 'DELETE_CALL_TO_DO', payload: [ {id: 1, rowStatus: {label: "New", id: "New"}}] });
    dispatch({ type: "SET_ACCOUNT_NAME", payload: "Account Name" });
    dispatch({ type: "SET_USER_FULL_NAME", payload: "User Name" });
    dispatch({ type: "ADD_TO_DO", payload: [ {id: 1, OCE__Status__c: "New"}] });
    dispatch({ type: "TO_DO", payload: [ {id: 2, OCE__Status__c: "New"}] });
    dispatch({ type: "ADD_BUSINESS_TO_DO", payload: [ {id: 1, OCE__Status__c: "New"}] });
    dispatch({ type: "BUSINESS_TO_DO", payload: [ {id: 2, OCE__Status__c: "New"}] });
    handleOpenToDo(true);
    handleCloseToDo(false);
    handleOpenBusinessToDo(true);
    handleCloseBusinessToDo(false);
    handleSaveToDo(true);
    saveToDosInDB([{id: 1, OCE__Status__c: "New"}], "TO_DO", 1);
    saveToDosInDB([{id: 1, OCE__Status__c: "New"}], "BUSINESS_TO_DO", 1);
    handleSaveBusinessToDo(true);
    closeMenu();
    showCallToDos();
    showCallBusinessToDos();
  };

  return (
    <TodoContext.Provider value={{ state, dispatch }}>
      <ApolloProvider theme={preferredTheme}>
        <ScrollView refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
          { showCallTodo &&
          <View>
            <Portal>
              <Modal
                visible={custom}
                onDismiss={() => handleCloseToDo(false)}
                contentContainerStyle={{ width: "100%", height: "100%" }}
              >
                <Modal.Title closeIcon />
                <Modal.Content>
                  <SearchToDo></SearchToDo>
                </Modal.Content>
                <Modal.Actions>
                  <Button
                    mode="tertiary"
                    onPress={() => handleCloseToDo(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    mode="contained"
                    onPress={() => handleSaveToDo(false)}
                  >
                    Save
                  </Button>
                </Modal.Actions>
              </Modal>
            </Portal>
            {refreshing && 
              <Card style={{margin: 50}}>
                <Loader />
              </Card>
            }
            {!refreshing && 
              <TableCallToDos buttonHeaders={buttonHeader} handleOpenToDos={handleOpenToDo} isTestCT={isTest} refreshing={refreshing}></TableCallToDos>
            }
          </View>
          }
          { showCallBusinessTodo &&
          <View>
            <Portal>
              <Modal
                visible={custom}
                onDismiss={() => handleCloseBusinessToDo(false)}
                contentContainerStyle={{ width: "100%", height: "100%" }}
              >
                <Modal.Title closeIcon />
                <Modal.Content>
                  <SearchBusinessToDo></SearchBusinessToDo>
                </Modal.Content>
                <Modal.Actions>
                  <Button
                    mode="tertiary"
                    onPress={() => handleCloseBusinessToDo(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    mode="contained"
                    onPress={() => handleSaveBusinessToDo(false)}
                  >
                    Save
                  </Button>
                </Modal.Actions>
              </Modal>
            </Portal>
            {refreshing && 
              <Card style={{margin: 50}}>
                <Loader />
              </Card>
            }
            {!refreshing && 
              <TableCallBusinessToDos buttonHeaders={buttonHeader} handleOpenBusinessToDos={handleOpenBusinessToDo} isTestCBT={isTest} refreshing={refreshing}></TableCallBusinessToDos>
            }
          </View>
          }
          { isTest &&
          <View>
            <Button
              testID='buttonFuncs-test'
              title="buttonFuncs-test"
              onPress={() => testFuncs()}
            />
          </View>
          }
        </ScrollView>
      </ApolloProvider>
    </TodoContext.Provider>
  );
};

const styles = StyleSheet.create({
  buttonK: {
    marginBottom: 8,
    width: "15%",
  },
  buttonWider: {
    marginBottom: 8,
    width: "20%",
  },
  container: {
    height: 600,
    flex: 1,
    flexBasis: "100%",
  },
});

export default App;