import { AntDesign } from "@expo/vector-icons";
import React, { useDeferredValue, useState } from "react";
import {
  PanResponder,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSharedValue, withSpring } from "react-native-reanimated";

const OFFSET = 70;
const LEFT_REACTION_MARGIN = 10;
const REACTION_WIDTH = 50;
const REACTION_HEIGHT = 50;
const ICON_ORIGINAL_HEIGHT = 24;
const SIZE_INCREASE = 10;

const App = () => {
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });
  const [isLongPressed, setIsLongPressed] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<
    number | undefined
  >();
  const deferredSelectedReactionId = useDeferredValue(selectedReaction);
  const iconSize = useSharedValue(ICON_ORIGINAL_HEIGHT);
  const [finalizedReaction, setFinalizedReaction] = useState<
    number | undefined
  >();

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: (event) => {
      const { locationX, locationY } = event.nativeEvent;
      setPosition({ x: locationX, y: locationY - OFFSET });
    },
  });

  const onReactionSelecting = (dragX: number) => {
    if (isLongPressed) {
      if (dragX < LEFT_REACTION_MARGIN + REACTION_WIDTH) {
        setSelectedReaction(1);
        iconSize.value = withSpring(ICON_ORIGINAL_HEIGHT + SIZE_INCREASE);
      } else if (
        dragX > LEFT_REACTION_MARGIN + REACTION_WIDTH &&
        dragX < LEFT_REACTION_MARGIN + 2 * REACTION_WIDTH
      ) {
        setSelectedReaction(2);
        iconSize.value = withSpring(ICON_ORIGINAL_HEIGHT + SIZE_INCREASE);
      } else if (
        dragX > LEFT_REACTION_MARGIN + REACTION_WIDTH &&
        dragX < LEFT_REACTION_MARGIN + 3 * REACTION_WIDTH
      ) {
        setSelectedReaction(3);
        iconSize.value = withSpring(ICON_ORIGINAL_HEIGHT + SIZE_INCREASE);
      }
    }
  };

  const renderSelectedReaction = () => {
    if (finalizedReaction === 1) {
      return <AntDesign name="like1" size={24} color="blue" />;
    } else if (finalizedReaction === 2) {
      return <AntDesign name="hearto" size={24} color="red" />;
    } else if (finalizedReaction === 3) {
      return <AntDesign name="infocirlceo" size={24} color="green" />;
    } else {
      return <Text style={{ fontSize: 18, marginLeft: 10 }}>Like</Text>;
    }
  };

  return (
    <SafeAreaView style={styles.container} {...panResponder.panHandlers}>
      <GestureHandlerRootView style={styles.container}>
        <View
          style={[
            styles.reactions,
            {
              display: isLongPressed ? "flex" : "none",
              top: isLongPressed ? position.y : undefined,
              marginLeft: LEFT_REACTION_MARGIN,
            },
          ]}
        >
          <View style={styles.reactIcon}>
            <AntDesign
              name={deferredSelectedReactionId === 1 ? "like1" : "like2"}
              size={deferredSelectedReactionId === 1 ? iconSize.value : 24}
              color="blue"
            />
          </View>
          <View style={styles.reactIcon}>
            <AntDesign
              name={deferredSelectedReactionId === 2 ? "heart" : "hearto"}
              size={deferredSelectedReactionId === 2 ? iconSize.value : 24}
              color="red"
            />
          </View>
          <View style={styles.reactIcon}>
            <AntDesign
              name={
                deferredSelectedReactionId === 3 ? "infocirlce" : "infocirlceo"
              }
              size={deferredSelectedReactionId === 3 ? iconSize.value : 24}
              color="green"
            />
          </View>
        </View>

        <Pressable
          onLongPress={(event) => {
            const { pageX, pageY } = event.nativeEvent;
            setPosition({ x: pageX, y: pageY - OFFSET });
            setIsLongPressed((isLongPressed) => !isLongPressed);
          }}
          onTouchMove={(event) => {
            if (isLongPressed) {
              const { pageX } = event.nativeEvent;
              onReactionSelecting(pageX);
            }
          }}
          onTouchEnd={() => {
            if (isLongPressed) {
              setIsLongPressed((isLongPressed) => !isLongPressed);
              setFinalizedReaction(selectedReaction);
            }
          }}
        >
          {renderSelectedReaction()}
        </Pressable>

        <StatusBar barStyle={"default"} />
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  reactions: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    display: "none",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    top: 2,
    elevation: 5,
    height: 50,
  },
  reactIcon: {
    height: REACTION_HEIGHT,
    width: REACTION_WIDTH,
    justifyContent: "center",
    alignItems: "center",
  },
});
