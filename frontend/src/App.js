import {
  Center,
  Text,
  Heading,
  VStack,
  Button,
  Input,
  HStack,
  Container,
  SimpleGrid,
  Box,
  Image,
  Spinner,
} from "@chakra-ui/react";

import { useState, useEffect } from "react";
import { ChakraProvider } from "@chakra-ui/react";

function App() {
  const [isSelected, setIsSelected] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [allVideos, setAllVideos] = useState([]);
  const [uploadSuccessful, setUploadSuccessful] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/videos")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setAllVideos(data);
      });
  }, [uploadSuccessful]);

  const onInputChange = (e) => {
    console.log(e.target.files[0]);
    setIsSelected(true);

    setSelectedFile(e.target.files[0]);
  };
  const onButtonClick = (e) => {
    console.log("Button clicked..");
    e.target.value = "";
  };

  const onFileUpload = (e) => {
    setShowSpinner(true);
    const formData = new FormData();
    formData.append("file", selectedFile, selectedFile.name);
    fetch("http://127.0.0.1:8000/videos", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success posting!!");
        setUploadSuccessful(!uploadSuccessful);
        setShowSpinner(false);
      });
  };
  return (
    <ChakraProvider>
      <Center bg="black" color="white" padding={8}>
        <VStack spacing={7}>
          <Heading>Your Video Gallery</Heading>
          <Text>Take a look at all your uploaded videos!!</Text>
          <HStack>
            <input
              type="file"
              onChange={onInputChange}
              onClick={onButtonClick}
            ></input>

            <Button
              size="lg"
              colorScheme="red"
              isDisabled={!isSelected}
              onClick={onFileUpload}
            >
              Upload Video
            </Button>
            {showSpinner && (
              <Center>
                <Spinner size="xl" />
              </Center>
            )}
          </HStack>
          <Heading>Your Videos</Heading>
          <SimpleGrid columns={3} spacing={8}>
            {allVideos.length !== 0 &&
              allVideos.map((video) => {
                return (
                  <video
                    src={video["video_url"]}
                    autoPlay
                    controls
                    loop
                    preload="auto"
                  ></video>
                );
              })}
          </SimpleGrid>
        </VStack>
      </Center>
    </ChakraProvider>
  );
}

export default App;
