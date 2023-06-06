# NESEE

NESEE is a tool designed to bring a new user-friendly experience to customize and interact with NFT bundles. It's the evolution of the [Nes3D](https://github.com/emoreno911/Nes3D) project, now using the Unique Network SDK and built for the Web3athon 2023 _#BUIDLtheFuture_

- Sponsor: Polkadot
- Challenge: Unique Network

*Website*: https://nesee.vercel.app/

*Demo*: https://youtu.be/__zArno_a2s

## The Problem

The fast evolution of new technologies in the blockchain ecosystem demands the creation of tools that facilitate their intuitive use. One of the recent technologies in the field of NFTs has to do with the nesting and customization of them.

The lack of user-friendly tools can make it difficult for first-time encounters with NFTs in any of their variations and limit their widespread adoption, as well as the use of new technologies.

## NESEE Features

With Nesse you'll have the opportunity to create bundles of NFTs in a very friendly way, for this you only have to drag and drop the elements contained within your wallet and group the NFTs as you see fit.

There are two ways to customize and interact with your bundles, in the first you simply connect your wallet and select the bundle you want to see in detail, then on the detail screen you can see the bundle diagram with its associated NFTs and by pressing the customize button you access the editor where you can create and associate a new image using the images of the children.

<img src="https://github.com/emoreno911/Nesee/blob/main/public/screen/detail.jpeg?raw=true" alt="image" />

In the second you have to click in the `Bundle Editor` link, once the wallet is connected you will be able to view all the NFTs contained in your wallet as a diagram where the children of the bundles are also shown. With this interface you will be able to create new bundles or edit the existing ones just by dragging and dropping the elements of the diagram. From here you can also customize the image associated with the bundles using the images of the children to make the composition, just press the `Detail Page` button and then access the customizer.

<img src="https://github.com/emoreno911/Nesee/blob/main/public/screen/editor.png?raw=true" alt="image" />

With the editor you will be able to generate a new image for your bundles using the images of the children for the composition, you also have available the options to rotate, move or change the size of the elements within the composition as well as the reorganization of these as layers. 

**Important**: Only the NFTs with the `type` attribute set to `root` are the ones who can be customized with its children images. You can recognize this "Bundle Containers" because they have a _green cube_ icon next to its title

<img src="https://github.com/emoreno911/Nesee/blob/main/public/screen/customizer.png?raw=true" alt="image" />

When updating the bundle image, the new image will be uploaded to the Unique Network decentralized storage and will be linked to the bundle image attribute. Then the attribute named `composition` will be updated, this one contains the `ipfsId` of a JSON document with the information about the composition of the bundle image (eg. associated images, rotation, dimensions).

## How is it built?
Nesee is made with ReactJS and the Unique Network SDK. For the interactive diagrams we use React flow and for the image bundle editor FabricJS.

## Challenges
One of the most significant challenges arose when we tried to add interactivity and ease of use to the mechanics of creating/manipulating the bundles, because despite the fact that we already had the objective of implementing drag and drop, the representation of the elements in a diagram was not something we got to the first time. 

Another interesting challenge was to establish how to regenerate the image of the bundle and that it could be manipulated for future editions since at the time of editing elements that were moved from the bundle could be missing, that's where we agreed to preserve certain attributes of the NFTs within the composition string in order to avoid these drawbacks.

## Accomplishments
Present a intuitive way to interact and customize NFT bundles