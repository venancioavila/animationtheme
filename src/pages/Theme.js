import React, {useState} from 'react';
import styled from 'styled-components';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  useAnimatedGestureHandler,
  withTiming,
} from 'react-native-reanimated';
import {PanGestureHandler} from 'react-native-gesture-handler';
import sun from '../assets/sun.png';
import moon from '../assets/moon.png';
import eclips from '../assets/eclipse.png';
import {StatusBar} from 'react-native';

const Wrapper = styled.View`
  flex: 1;
  align-items: center;
  background: #fff;
  flex-direction: column;
  justify-content: center;
`;

const SlidWrapper = styled.View`
  width: 70%;
  height: 60px;
  background: #e6e6e6;
  border-radius: 40px;
  flex-direction: row;
  align-items: center;
`;

const Interupt = styled(Animated.View)`
  width: 50%;
  height: 60px;
  background: #fff;
  border-radius: 40px;
  elevation: 5;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const InteruptText = styled.Text`
  font-size: 18px;
  color: #666666;
  text-align: center;
`;

const AstroWrapper = styled.View`
  align-items: center;
  justify-content: center;
  height: 150px;
  width: 150px;
  border-radius: 75px;
  margin: 20px;
  overflow: hidden;
  margin-bottom: 50px;
`;

const AstroImage = styled(Animated.Image)`
  height: 150px;
`;

const AstroImageOpacity = styled(Animated.Image)`
  height: 150px;
  opacity: 0;
  position: absolute;
`;

const AstroImageEclipse = styled(Animated.Image)`
  height: 150px;
  position: absolute;
  left: 60px;
  top: -60px;
`;

const Title = styled(Animated.Text)`
  font-size: 30px;
  color: #666666;
  font-weight: bold;
`;

const Text = styled(Animated.Text)`
  font-size: 18px;
  color: #666666;
  text-align: center;
  margin: 20px;
  margin-bottom: 50px;
  padding-horizontal: 30px;
`;

const Theme = () => {
  const posX = useSharedValue(0);
  const [background, setBackground] = useState('#FFF');
  const [theme, setTheme] = useState('light');
  const [slidWrapperColor, setSlidWrapperColor] = useState('#e6e6e6');
  const [slidColor, setSlidColor] = useState('#FFF');
  const [textColor, setTextColor] = useState('#000');

  const onGestureHandler = useAnimatedGestureHandler({
    onStart(event, ctx) {
      ctx.posX = posX.value;
    },
    onActive(event, ctx) {
      posX.value = ctx.posX + event.translationX;
    },
    onEnd(event, ctx) {
      if (event.translationX > 69) {
        posX.value = withTiming(138);
        setBackground('#1C1C1C');
        setTheme('dark');
        setSlidWrapperColor('#000');
        setTextColor('#FFF');
        setSlidColor('#3E3E3E');
        return;
      }
      posX.value = withTiming(0);
      setBackground('#FFF');
      setTheme('light');
      setSlidWrapperColor('#e6e6e6');
      setSlidColor('#FFF');
      setTextColor('#000');
    },
  });

  const positionStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: posX.value}],
    };
  });

  const moonStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(posX.value, [0, 100], [0, 1], Extrapolate.CLAMP),
    };
  });

  const eclipseStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: interpolate(posX.value, [0, 100], [0, -70])},
        {translateY: interpolate(posX.value, [0, 100], [0, 30])},
      ],
    };
  });

  return (
    <Wrapper style={{backgroundColor: background}}>
      <StatusBar
        barStyle={theme === 'light' ? 'dark-content' : 'light-content'}
        backgroundColor={background}
      />
      <AstroWrapper>
        <AstroImage resizeMode="contain" source={sun} />
        <AstroImageOpacity
          style={moonStyle}
          resizeMode="contain"
          source={moon}
        />
        <AstroImageEclipse
          style={eclipseStyle}
          resizeMode="contain"
          source={eclips}
        />
      </AstroWrapper>
      <Title style={{color: textColor}}>Choose a style</Title>
      <Text style={{color: textColor}}>
        Pop or subtle. Day or night. Customize your interface.
      </Text>
      <SlidWrapper style={{backgroundColor: slidWrapperColor}}>
        <PanGestureHandler onGestureEvent={onGestureHandler}>
          <Interupt style={[positionStyle, {backgroundColor: slidColor}]}>
            <InteruptText style={{color: textColor}}>{theme}</InteruptText>
          </Interupt>
        </PanGestureHandler>
      </SlidWrapper>
    </Wrapper>
  );
};

export default Theme;
