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
  Input,
  Textarea,
  Heading,
  Select,
  Checkbox,
  Grid,
  createListCollection,
  HStack,
  RadioCard
} from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import { toaster } from "./components/ui/toaster";

export default function App() {

  const closeDialogRef = useRef(null);
  const dialogRef = useRef<HTMLDivElement>(null)

  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem("todos");
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [priority, setPriority] = useState("Low");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [filter, setFilter] = useState({ priority: "High", date: "" });
  

  const handleAddTodo = () => {
    if (!title) return;
    const newTodo = {
      id: Date.now(),
      title,
      detail,
      priority,
      date,
      startTime,
      endTime,
      location,
      checked: false,
    };
    setTodos((prev) => [...prev, newTodo]);
    setTitle("");
    setDetail("");
    setPriority("Low");
    setDate("");
    setStartTime("");
    setEndTime("");
    setLocation("");

    // Tutup dialog
    if (closeDialogRef.current) {
      closeDialogRef.current.click();
    }
  };

  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const toggleChecked = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, checked: !todo.checked } : todo
      )
    );
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter.priority !== "All" && todo.priority !== filter.priority)
      return false;
    if (filter.date && todo.date !== filter.date) return false;
    return true;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const upcoming = todos.find((todo) => {
        if (!todo.date || !todo.startTime) return false;
        const reminderTime = new Date(`${todo.date}T${todo.startTime}`);
        return (
          !todo.checked &&
          reminderTime - now > 0 &&
          reminderTime - now < 60000 // within 1 minute
        );
      });
      if (upcoming) {
        toaster.create({
          title: "Upcoming Task",
          description: upcoming.title,
          type: "info",
          duration: 5000,
        });
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [todos, toaster]);

  const handleDeleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  return (
    <Center minH="100vh" flexDirection="column" gap="4">
      <Heading
        fontSize="3xl"
        fontWeight="bold"
        color="purple.400"
        textAlign="center"
        textShadow="0 0 10px rgba(136, 85, 255, 0.8)"
      >
        To-Do List App
      </Heading>

      <Grid gap={2} templateColumns="repeat(2, 1fr)" alignItems="center">
        <RadioCard.Root
          value={filter.priority}
          onValueChange={(val) => {
            console.log("priority changed to", val);
            setFilter((prev) => ({ ...prev, priority: val }));
          }}
          h="full"
        >
          <HStack align="stretch" h="full">
            {["All", "Low", "Medium", "High"].map((p) => (
              <RadioCard.Item key={p} value={p}>
                <RadioCard.ItemHiddenInput />
                <RadioCard.ItemControl>
                  <RadioCard.ItemText>{p}</RadioCard.ItemText>
                  <RadioCard.ItemIndicator />
                </RadioCard.ItemControl>
              </RadioCard.Item>
            ))}
          </HStack>
        </RadioCard.Root>
        <Input
          type="date"
          value={filter.date}
          onChange={(e) => setFilter({ ...filter, date: e.target.value })}
          h="full"
        />
      </Grid>

      <Dialog.Root motionPreset="slide-in-bottom">
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
            <Dialog.Content ref={dialogRef}>
              <Dialog.Header>
                <Dialog.Title>Tambah To-do</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Stack spacing="4">
                  <Input
                    placeholder="Judul Kegiatan"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <Textarea
                    placeholder="Detail Kegiatan"
                    rows={4}
                    value={detail}
                    onChange={(e) => setDetail(e.target.value)}
                  />
                  <RadioCard.Root
                    value={priority}
                    onValueChange={setPriority}
                  >
                    <RadioCard.Label>Pilih Prioritas</RadioCard.Label>
                    <HStack align="stretch" wrap="wrap">
                      {listPriority.items
                        .filter((item) => item.value !== "All") // hilangkan "All" dari form input
                        .map((item) => (
                          <RadioCard.Item key={item.value} value={item.value}>
                            <RadioCard.ItemHiddenInput />
                            <RadioCard.ItemControl>
                              <RadioCard.ItemText>{item.label}</RadioCard.ItemText>
                              <RadioCard.ItemIndicator />
                            </RadioCard.ItemControl>
                          </RadioCard.Item>
                        ))}
                    </HStack>
                  </RadioCard.Root>
                  <Input
                    placeholder="Tempat"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                  <Input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                  <Input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
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
                  onClick={handleAddTodo}
                >
                  Save
                </Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <button ref={closeDialogRef} style={{ display: "none" }} />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

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
            {filteredTodos.map((item) => (
              <Accordion.Item key={item.id} value={String(item.id)}>
                <Box position="relative">
                  <Accordion.ItemTrigger>
                    <Checkbox.Root>
                      <Checkbox.HiddenInput />
                      <Checkbox.Control
                        isChecked={item.checked}
                        onChange={() => toggleChecked(item.id)}
                      />
                      <Checkbox.Label />
                    </Checkbox.Root>
                    <Span flex="1">{item.title}</Span>
                    <Accordion.ItemIndicator />
                  </Accordion.ItemTrigger>
                  <AbsoluteCenter axis="vertical" insetEnd="0">
                  <Button
                    size="xs"
                    colorPalette="red"
                    variant="subtle"
                    onClick={() => handleDeleteTodo(item.id)}
                  >
                    Delete
                  </Button>
                  </AbsoluteCenter>
                </Box>
                <Accordion.ItemContent>
                  <Accordion.ItemBody>
                    <Text>{item.detail}</Text>
                    <Text fontSize="sm" mt={2} color="gray.500">
                      Tanggal: {item.date || "-"}, Jam: {item.startTime} - {item.endTime}<br />
                      Tempat: {item.location || "-"}, Prioritas: {item.priority}
                    </Text>
                  </Accordion.ItemBody>
                </Accordion.ItemContent>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </Stack>
      </Box>

      {/* Kalender Mini */}
      <Box
        position="fixed"
        bottom="4"
        right="4"
        w="xs"
        shadow="md"
        borderWidth="1px"
        borderRadius="lg"
        p="4"
        zIndex="100"
      >
        <Text fontWeight="bold" mb="2">
          Kalender
        </Text>
        <Stack spacing="2">
          {todos
            .filter((todo) => todo.date)
            .sort((a, b) => a.date.localeCompare(b.date))
            .map((todo) => (
              <Box key={todo.id} fontSize="sm">
                <Text fontWeight="semibold">
                  {todo.date
                    .split("-")
                    .reverse()
                    .join("-")} - {todo.title}
                </Text>
              </Box>
            ))}
        </Stack>
      </Box>
    </Center>
  );
}

const listPriority = createListCollection({
  items: [
    { label: "All", value: "All" },
    { label: "Low", value: "Low" },
    { label: "Medium", value: "Medium" },
    { label: "High", value: "High" },
  ],
})