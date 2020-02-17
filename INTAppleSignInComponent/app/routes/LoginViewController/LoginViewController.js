//The MIT License (MIT)
//
//Copyright (c) 2020 INTUZ
//
//Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
//
//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

import React, { Component } from 'react'
import {
    SafeAreaView,
    Text,
    Alert,
    TouchableOpacity,
    View
} from 'react-native'

import styles from './styles'

import AsyncStorage from '@react-native-community/async-storage';
import appleAuth, {
    AppleButton,
    AppleAuthRequestOperation,
    AppleAuthRequestScope,
    AppleAuthCredentialState,
} from '@invertase/react-native-apple-authentication';

class LoginViewController extends Component {

    static navigationOptions = {
        header: null,
    }

    constructor(props) {
        super(props)
        this.state = {
            userData: null
        }
    }

    async componentDidMount() {
        try {
            const value = await AsyncStorage.getItem('userInfo')
            if (value !== null) {
                this.setState({
                    userData: JSON.parse(value)
                })
            }
        } catch (e) {
            // error reading value
        }
    }

    async onAppleButtonPress() {
        // performs login request
        const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: AppleAuthRequestOperation.LOGIN,
            requestedScopes: [AppleAuthRequestScope.EMAIL, AppleAuthRequestScope.FULL_NAME],
        });

        // get current authentication state for user
        const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);

        // use credentialState response to ensure the user is authenticated
        if (credentialState === AppleAuthCredentialState.AUTHORIZED) {
            // user is authenticated
        }
    }

    onLogoutTapped() {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                { text: 'Yes', onPress: () => this.onLogout() },
            ],
            { cancelable: true }
        )
    }

    async onLogout() {
        this.setState({ userData: null });
        AsyncStorage.removeItem("userInfo", () => { });
        // performs logout request
        const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: AppleAuthRequestOperation.LOGOUT,
        });

        // get current authentication state for user
        const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);

        // use credentialState response to ensure the user credential's have been revoked
        if (credentialState === AppleAuthCredentialState.REVOKED) {
            // user is unauthenticated
        }
    }

    render() {
        return (
            <SafeAreaView style={styles.safeAreaView}>
                <View>
                    <AppleButton
                        style={{
                            alignSelf: 'center',
                            width: 200,
                            height: 60,
                            margin: 10,
                        }}
                        buttonStyle={AppleButton.Style.WHITE}
                        buttonType={AppleButton.Type.SIGN_IN}
                        onPress={this.onAppleButtonPress.bind(this)}
                    />
                    {
                        this.state.userData != null ?
                            <TouchableOpacity style={styles.subLogoutContainer} onPress={this.onLogoutTapped.bind(this)}>
                                <Text>Welcome {this.state.userData.name}! Touch to Logout!</Text>
                            </TouchableOpacity>
                            :
                            null
                    }
                </View>
            </SafeAreaView >
        )
    }
}
export default LoginViewController