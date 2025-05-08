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
  Text,
} from "@chakra-ui/react";
import { useState } from "react";

export default function App() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    title: "",
    detail: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
  });
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!form.title.trim()) return;

    const newItem = {
      ...form,
      value: Date.now().toString(),
    };

    setItems((prev) => [...prev, newItem]);
    setForm({
      title: "",
      detail: "",
      date: new Date().toISOString().slice(0, 10),
      startTime: "",
      endTime: "",
      location: "",
    });
    setIsOpen(false);
  };

  const handleDelete = (value) => {
    setItems((prev) => prev.filter((item) => item.value !== value));
  };

  return (
    <Center minH="100vh" flexDirection="column" gap="4">
      {/* Judul */}
      <Heading
        fontSize="3xl"
        fontWeight="bold"
        color="purple.400"
        textAlign="center"
        textShadow="0 0 10px rgba(136, 85, 255, 0.8)"
      >
        To-Do List App
      </Heading>

      {/* Dialog Tambah */}
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
                <Dialog.Title>Tambah Kegiatan</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Stack spacing="3">
                  <Input
                    placeholder="Judul Kegiatan"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                  />
                  <Textarea
                    placeholder="Detail Kegiatan"
                    rows={3}
                    name="detail"
                    value={form.detail}
                    onChange={handleChange}
                  />
                  <Input
                    type="date"
                    name="date"
                    value={new Date().toISOString().slice(0, 10)}
                    onChange={handleChange}
                  />
                  <Input
                    type="time"
                    placeholder="Jam Mulai"
                    name="startTime"
                    value={form.startTime}
                    onChange={handleChange}
                  />
                  <Input
                    type="time"
                    placeholder="Jam Beres"
                    name="endTime"
                    value={form.endTime}
                    onChange={handleChange}
                  />
                  <Input
                    placeholder="Tempat"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
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

      {/* Accordion Box */}
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
          <Accordion.Root variant="plain" collapsible defaultValue={[]}>
            {items.map((item) => (
              <Accordion.Item key={item.value} value={item.value}>
                <Box position="relative">
                  <Accordion.ItemTrigger>
                    <Span flex="1">{item.title}</Span>
                    <Accordion.ItemIndicator />
                  </Accordion.ItemTrigger>
                  <AbsoluteCenter axis="vertical" insetEnd="0">
                    <Button
                      size="xs"
                      variant="subtle"
                      colorPalette="red"
                      onClick={() => handleDelete(item.value)}
                    >
                      Delete
                    </Button>
                  </AbsoluteCenter>
                </Box>
                <Accordion.ItemContent>
                  <Accordion.ItemBody>
                    <Stack spacing="2" fontSize="sm">
                      <Text><strong>Detail:</strong> {item.detail}</Text>
                      <Text><strong>Tanggal:</strong> {item.date}</Text>
                      <Text><strong>Jam:</strong> {item.startTime} - {item.endTime}</Text>
                      <Text><strong>Tempat:</strong> {item.location}</Text>
                    </Stack>
                  </Accordion.ItemBody>
                </Accordion.ItemContent>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </Stack>
      </Box>
    </Center>
  );
}
