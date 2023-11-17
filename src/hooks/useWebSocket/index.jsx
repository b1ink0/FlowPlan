import { useStateContext } from "../../context/StateContext";

export const useWebSocket = () => {
  const { ws, setWs } = useStateContext();
  const handleCreateWebSocket = () => {
    const socket = new WebSocket("ws://localhost:3000/t");
    socket.onopen = () => {
      console.log("Connected");
    };
    socket.onclose = () => {
      console.log("Disconnected");
    };
    setWs(socket);
    return socket;
  };
  const handleSendMessage = (message) => {
    ws.send(message);
  };

  const handleReceiveMessage = (setData) => {
    ws.onmessage = (event) => {
      console.log(event.data);
      setData(JSON.parse(event.data));
    };
  };

  return { handleCreateWebSocket, handleSendMessage, handleReceiveMessage };
};
