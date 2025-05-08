import { Accordion, Box, Center, Stack, Text, Span } from "@chakra-ui/react";
import { useState } from "react";

export default function App() {
  const [value, setValue] = useState(["second-item"]);

  return (
    <Center minH="100vh">
      <Box w="full" maxW="md" p="6" borderWidth="1px" borderRadius="lg" boxShadow="md">
        <Stack gap="4">
          <Text fontWeight="medium">Expanded: {value.join(", ")}</Text>
          <Accordion.Root value={value} onValueChange={(e) => setValue(e.value)}>
            {items.map((item, index) => (
              <Accordion.Item key={index} value={item.value}>
                <Accordion.ItemTrigger>
                  <Span flex="1">{item.title}</Span>
                  <Accordion.ItemIndicator />
                </Accordion.ItemTrigger>
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
  { value: "first-item", title: "First Item", text: "Some value 1..." },
  { value: "second-item", title: "Second Item", text: "Some value 2..." },
  { value: "third-item", title: "Third Item", text: "Some value 3..." },
];

