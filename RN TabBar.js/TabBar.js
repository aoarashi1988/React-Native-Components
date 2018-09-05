import React, { Component } from 'react';
import { View, Text, StyleSheet, Animated, Easing, TouchableOpacity, Dimensions } from 'react-native';
import PropTypes from 'prop-types';

export default class Tab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentIndex: 0
        }

        this.MoveAnimated = new Animated.Value(0)
    }

    createAnimate = (obj, toValue, duration, easing) => {
        return Animated.timing(obj, {
            toValue,
            duration,
            easing: Easing.circle,
        }).start()
    }

    changeTab = (tab, index) => {
        if (index !== this.state.currentIndex) {
            this.createAnimate(this.MoveAnimated, index, 300)
            this.setState({ currentIndex: index })
            this.props.onChange && this.props.onChange(tab)
        }
    }

    render() {
        const { tabs, primaryColor } = this.props

        const styles = StyleSheet.create({
            container: {
                flexDirection: 'row',
                height: 45,
                backgroundColor: '#fff',
                borderBottomColor: '#dfdfdf',
                borderBottomWidth: 1,
            },
            tab: {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            },
            tabLine: {
                position: 'absolute',
                bottom: 0,
                width: `${1 / tabs.length / 2 * 100}%`,
                height: 2,
                backgroundColor: primaryColor
            }
        })

        const moveInput = createMoveInput(tabs)
        const moveOutput = createMoveOutput(tabs)

        const moveMe = this.MoveAnimated.interpolate({
            inputRange: moveInput,
            outputRange: moveOutput
        })

        return (
            <View style={[styles.container, this.props.wrapStyle]}>
                {tabs.map((tab, index) => <TouchableOpacity style={styles.tab} key={index} onPress={() => this.changeTab(tab, index)} activeOpacity={1}>
                    <Text style={[styles.tabText, this.props.textStyle]}>{tab.label}</Text>
                </TouchableOpacity>)}
                <Animated.View style={[styles.tabLine, { left: moveMe }]}></Animated.View>
            </View>
        );
    }
}

Tab.propsTypes = {
    onChange: PropTypes.func,
    tabs: PropTypes.array,
    textStyle: PropTypes.object,
    primaryColor: PropTypes.string,
    wrapStyle: PropTypes.object
}
Tab.defaultProps = {
    onChange: () => { },
    tabs: [{ label: 'tab1', value: 0 }, { label: 'tab2', value: 1 }],
    textStyle: { color: '#333', fontSize: 14 },
    primaryColor: '#ff8740',
}

function createMoveInput(tabs) {
    let inputRange = []
    for (let index = 0; index < tabs.length; index++) {
        inputRange.push(index)
    }
    return inputRange
}

function createMoveOutput(tabs) {
    const length = tabs.length
    const { width: winWidth } = Dimensions.get('window')
    let width = winWidth / length / 2
    let outputRange = []
    for (let index = 0; index < length; index++) {
        let offset = (.5 + index * 2) * width
        outputRange.push(offset)
    }
    return outputRange
}
