import {
  AbsoluteCenter,
  Accordion,
  Box,
  Center,
  Stack,
  Text,
  Span,
  Button,
  CloseButton,
  Dialog,
  Portal,
} from "@chakra-ui/react";
import { useState } from "react";

export default function App() {
  const [value] = useState(["a"]);

  return (
    <Center minH="100vh">
      <Box
        w="full"
        maxW="md"
        p="6"
        borderWidth="1px"
        borderRadius="lg"
        boxShadow="md"
        _dark={{ boxShadow: "0 0 10px 0 rgba(136, 85, 255, 0.8)" }}
      >
        <Stack gap="4">
          {/* Tambahkan dialog button */}
          <Dialog.Root motionPreset="slide-in-bottom">
            <Dialog.Trigger asChild>
              <Button colorScheme="purple" variant="outline">
                Add To-do List
              </Button>
            </Dialog.Trigger>
            <Portal>
              <Dialog.Backdrop />
              <Dialog.Positioner>
                <Dialog.Content>
                  <Dialog.Header>
                    <Dialog.Title>Tambah To-do</Dialog.Title>
                  </Dialog.Header>
                  <Dialog.Body>
                    <p>
                      Ini adalah dialog placeholder. Kamu bisa mengganti ini
                      dengan form input nanti.
                    </p>
                  </Dialog.Body>
                  <Dialog.Footer>
                    <Dialog.ActionTrigger asChild>
                      <Button variant="outline">Cancel</Button>
                    </Dialog.ActionTrigger>
                    <Button colorScheme="purple">Save</Button>
                  </Dialog.Footer>
                  <Dialog.CloseTrigger asChild>
                    <CloseButton size="sm" />
                  </Dialog.CloseTrigger>
                </Dialog.Content>
              </Dialog.Positioner>
            </Portal>
          </Dialog.Root>

          {/* Accordion */}
          <Accordion.Root spaceY="4" variant="plain" collapsible defaultValue={["a"]}>
            {items.map((item, index) => (
              <Accordion.Item key={index} value={item.value}>
                <Box position="relative">
                  <Accordion.ItemTrigger>
                    <Span flex="1">{item.title}</Span>
                    <Accordion.ItemIndicator />
                  </Accordion.ItemTrigger>
                  <AbsoluteCenter axis="vertical" insetEnd="0">
                    <Button variant="subtle" colorPalette="red">
                      Action
                    </Button>
                  </AbsoluteCenter>
                </Box>
                <Accordion.ItemContent>
                  <Accordion.ItemBody>{item.text}</Accordion.ItemBody>
                </Accordion.ItemContent>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </Stack>
      </Box>
    </Center>
  );
}

const items = [
  { value: "a", title: "First Item", text: "Lorem Ipsum" },
  { value: "b", title: "Second Item", text: "Lorem Ipsum" },
  { value: "c", title: "Third Item", text: "Lorem Ipsum" },
]