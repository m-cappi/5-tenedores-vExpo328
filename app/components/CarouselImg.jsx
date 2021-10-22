import React from "react";
import { Image } from "react-native-elements";
import Carousel from "react-native-snap-carousel";

const CarouselImg = ({arrayImg, height, width}) => {

    const renderItem = ({item}) =>{
        return <Image 
        style={{width, height}}
        source={{uri:item}}
        />
    }
    return (
        <Carousel 
        layout={"default"}
        data={arrayImg}
        sliderWidth={width}
        itemWidth={width}
        renderItem={renderItem}
        />
    );
};

export default CarouselImg;
