const sharp = require('sharp');
const fs = require('fs');

const inputImage = 'client/img/attack/punch.png'; // Replace with your image path
const outputImage = 'spritesheets/punch.png'; // Replace with your desired output path
const spriteWidth = 30; // Replace with your sprite width
const spriteHeight = 30; // Replace with your sprite height

const directions = [
    { angle: 0, flip: false }, // Right
    { angle: 45, flip: false }, // Up-Right
    { angle: 90, flip: false }, // Up
    { angle: 45, flip: true }, // Up-Left
    { angle: 0, flip: true }, // Left
    { angle: 315, flip: true }, // Down-Left
    { angle: 270, flip: false }, // Down
    { angle: 315, flip: false }, // Down-Right
];

const images = directions.map(({ angle, flip }) => {
    let image = sharp(inputImage).rotate(angle);
    if (flip) {
        image = image.flop();
    }
    return image.resize(spriteWidth, spriteHeight).toBuffer();
});

Promise.all(images)
    .then(buffers => {
        const compositeOperations = buffers.map((buffer, index) => ({
            input: buffer,
            left: index * spriteWidth,
            top: 0
        }));

        return sharp({
            create: {
                width: spriteWidth * directions.length,
                height: spriteHeight,
                channels: 4,
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            }
        })
            .composite(compositeOperations)
            .toFile(outputImage);
    })
    .then(() => {
        console.log('Sprite sheet generated successfully!');
    })
    .catch(err => {
        console.error('Error generating sprite sheet:', err);
    });