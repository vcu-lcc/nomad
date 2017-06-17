// Import ReactJS and React-DOM
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
// Import react-desktop components
import {
    Button,
    Label,
    ProgressCircle,
    Text,
    TextInput,
    View
} from 'react-desktop/windows';

class LoginFragment extends React.Component {
    constructor() {
        super();
        this.state = {
            loading: false
        };
        this.username = '';
        this.password = '';
        this.submit = function() {
            console.log(this.username, this.password);
        }.bind(this);
    }

    render() {
        return (
            <View
                verticalAlignment="center"
                horizontalAlignment="center"
            >
                <img
                    src="images/vcu.png"
                    height="130px"
                    width="130px"
                    onClick={() => location.reload()}
                    style={{
                        padding: '10px',
                        borderRight: 'solid #EEEEEE 1px'
                    }}
                />
                <View
                    padding="10px"
                    layout="vertical"
                >
                    <Label
                        margin="5px"
                    >
                        <span
                            style={{
                                fontSize: '16px',
                                fontWeight: '600'
                            }}
                        >
                            Enterprise Login
                        </span>
                    </Label>
                    <TextInput
                        placeholder="Username"
                        margin="5px"
                        width={256}
                        onChange={e => void(this.username = e.target.value)}
                    />
                    <TextInput
                        password={true}
                        placeholder="Password"
                        margin="5px"
                        width={256}
                        onChange={e => void(this.password = e.target.value)}
                    />
                    <div
                        style={{
                            margin: '10px 5px 5px 5px',
                            display: 'flex',
                            flexDirection: 'row-reverse'
                        }}
                    >
                        <Button
                            type="submit"
                            onClick={this.submit}
                        >
                            Sign in
                        </Button>
                        <ProgressCircle
                            hidden={!this.state.loading}
                        />
                    </div>
                </View>
            </View>
        );
    }
}

ReactDOM.render(<LoginFragment></LoginFragment>, document.querySelector('#react-root'));