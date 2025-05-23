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
  const dialogRef = useRef(null);

  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem("todos");
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [priority, setPriority] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [filter, setFilter] = useState({
    priority: "All",
    startDate: new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 1)).toISOString().split('T')[0],
    endDate: new Date(new Date().setDate(new Date().getDate() + (7 - new Date().getDay()))).toISOString().split('T')[0]
  });
  
  const listPriority = createListCollection({
    items: [
      { label: "All", value: "All" },
      { label: "Low", value: "Low" },
      { label: "Medium", value: "Medium" },
      { label: "High", value: "High" },
    ],
  });

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

    if (closeDialogRef.current) {
      closeDialogRef.current.click();
    }
  };

  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
    console.log("Todos:", todos);
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
    
    if (filter.startDate && filter.endDate && todo.date) {
      return todo.date >= filter.startDate && todo.date <= filter.endDate;
    }
    
    return true;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();

      todos.forEach((todo) => {
        if (!todo.date || !todo.startTime || todo.checked) return;

        const reminderTime = new Date(`${todo.date}T${todo.startTime}`);
        const timeDiff = reminderTime - now;

        if (timeDiff > 0 && timeDiff < 600000 && !todo.notified) {
          console.log(`Upcoming task: ${todo.title} will start in less than 10 minutes.`);

          toaster.create({
            title: "Upcoming Task",
            description: todo.title,
            type: "error",
            duration: 30000,
          });

          todo.notified = true;
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [todos]);

  const handleDeleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  return (
    <Center minH="100vh" flexDirection="column" gap="4" p={{ base: "4", md: "6" }}>
      <Heading
        fontSize={{ base: "2xl", md: "3xl" }}
        fontWeight="bold"
        color="purple.400"
        textAlign="center"
        textShadow="0 0 10px rgba(136, 85, 255, 0.8)"
      >
        To-Do List App
      </Heading>

      <Stack spacing={4} width="full" maxW="md">
        <RadioCard.Root
          id="priority-filter"
          value={filter.priority}
          onValueChange={(val) => {
            setFilter((prev) => ({ ...prev, priority: val.value }));
          }}
        >
          <HStack align="stretch" wrap="wrap">
            {listPriority.items.map((p) => (
              <RadioCard.Item key={p.value} value={p.value}>
                <RadioCard.ItemHiddenInput />
                <RadioCard.ItemControl>
                  <RadioCard.ItemText>{p.label}</RadioCard.ItemText>
                  <RadioCard.ItemIndicator />
                </RadioCard.ItemControl>
              </RadioCard.Item>
            ))}
          </HStack>
        </RadioCard.Root>
        
        <Grid gap={2} templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} alignItems="center">
          <Box>
            <Input
              id="start-date"
              type="date"
              value={filter.startDate}
              onChange={(e) => setFilter(prev => ({ ...prev, startDate: e.target.value }))}
            />
          </Box>
          <Box>
            <Input
              id="end-date"
              type="date"
              value={filter.endDate}
              onChange={(e) => setFilter(prev => ({ ...prev, endDate: e.target.value }))}
            />
          </Box>
        </Grid>
      </Stack>

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
                <Dialog.Title>Add To-do</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Stack spacing="4">
                  <Input
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <Textarea
                    placeholder="Detail"
                    rows={4}
                    value={detail}
                    onChange={(e) => setDetail(e.target.value)}
                  />
                  <RadioCard.Root
                    id="priority-select"
                    value={priority}
                    onValueChange={(val) => {
                      setPriority(val.value);
                    }}
                  >
                    <HStack align="stretch" wrap="wrap">
                      {listPriority.items
                        .filter((item) => item.value !== "All")
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
                    placeholder="Place"
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
                  <Button variant="outline">Cancel</ Button>
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
        p={{ base: "4", md: "6" }}
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
                        checked={item.checked}
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
                      Tanggal: {item.date || "-"}, Jam: {item.startTime || "-"} - {item.endTime || "-"}<br />
                      Tempat: {item.location || "-"}, Prioritas: {item.priority}
                    </Text>
                  </Accordion.ItemBody>
                </Accordion.ItemContent>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </Stack>
      </Box>

      <Box
        position="fixed"
        bottom="4"
        right={{ base: "auto", md: "4" }}
        left={{ base: "auto", md: "auto" }}
        mx={{ base: "auto", md: "0" }}
        w="full"
        maxW={{ base: "sm", md: "xs" }}
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
                    .join("-")}{" "}
                  - {todo.title}
                </Text>
              </Box>
            ))}
        </Stack>
      </Box>
    </Center>
  );
} 