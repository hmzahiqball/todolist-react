import {
  AbsoluteCenter,
  Accordion,
  Box,
  Center,
  Stack,
  Span,
  Button,
  CloseButton,
  Dialog,
  Portal,
  Input,
  Textarea,
  Heading,
} from "@chakra-ui/react";
import { useState } from "react";

export default function App() {
  const [items, setItems] = useState([]);
  const [judul, setJudul] = useState("");
  const [detail, setDetail] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    if (!judul.trim()) return;
    const newItem = {
      value: Date.now().toString(),
      title: judul,
      text: detail,
    };
    setItems((prev) => [...prev, newItem]);
    setJudul("");
    setDetail("");
    setIsOpen(false);
  };

  const handleDelete = (value) => {
    setItems((prev) => prev.filter((item) => item.value !== value));
  };

  return (
    <Center minH="100vh" flexDirection="column" gap="4">
      {/* Judul dengan efek glow */}
      <Heading
        fontSize="3xl"
        fontWeight="bold"
        color="purple.400"
        textAlign="center"
        textShadow="0 0 10px rgba(136, 85, 255, 0.8)"
      >
        To-Do List App
      </Heading>

      {/* Tombol dialog di atas box */}
      <Dialog.Root open={isOpen} onOpenChange={setIsOpen} motionPreset="slide-in-bottom">
        <Dialog.Trigger asChild>
          <Button
            colorPalette="purple"
            variant="outline"
            boxShadow="0 0 10px 0 rgba(136, 85, 255, 0.8)"
          >
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
                <Stack spacing="4">
                  <Input
                    placeholder="Judul Kegiatan"
                    value={judul}
                    onChange={(e) => setJudul(e.target.value)}
                  />
                  <Textarea
                    placeholder="Detail Kegiatan"
                    rows={4}
                    value={detail}
                    onChange={(e) => setDetail(e.target.value)}
                  />
                </Stack>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </Dialog.ActionTrigger>
                <Button
                  colorPalette="purple"
                  variant="outline"
                  onClick={handleSave}
                >
                  Save
                </Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      {/* Box dengan accordion */}
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
          <Accordion.Root
            spaceY="4"
            variant="plain"
            collapsible
            defaultValue={[]}
          >
            {items.map((item, index) => (
              <Accordion.Item key={item.value} value={item.value}>
                <Box position="relative">
                  <Accordion.ItemTrigger>
                    <Span flex="1">{item.title}</Span>
                    <Accordion.ItemIndicator />
                  </Accordion.ItemTrigger>
                  <AbsoluteCenter axis="vertical" insetEnd="0">
                    <Button
                      variant="subtle"
                      colorPalette="red"
                      onClick={() => handleDelete(item.value)}
                    >
                      Delete
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
