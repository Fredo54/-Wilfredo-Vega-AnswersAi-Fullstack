import { Socket } from "socket.io";
import { Message } from "../index";
import { openai } from "../index";
import TokenService from "../service/tokenService";
import ChatsService from "../service/chatsService";

class WsController {
  static async handleConnect(socket: Socket) {
    console.log("Client connected");
    socket.emit("message", "Hello from server");
  }
  static async getTokens(socket: Socket, userId: string) {
    try {
      const tokensData = await TokenService.getTokenUsage({ userId });
      socket.emit("get tokens", tokensData[0].tokenCount);
    } catch (error) {
      console.error("Error getting tokens:", error);
    }
  }

  static async handleDisconnect(socket: Socket) {
    console.log("Client disconnected");
  }

  static async handleAIMessage({
    tokenCount,
    text,
  }: {
    tokenCount: number;
    text: string;
  }) {
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: text },
      ],
      max_tokens: tokenCount,
      model: "gpt-3.5-turbo",
    });

    return chatCompletion;
  }

  static async handleChatMessage(socket: Socket, message: Message) {
    const { userId, message: text } = message;
    let userTokens = await TokenService.getTokenUsage({ userId });
    try {
      const chatCompletion = await WsController.handleAIMessage({
        tokenCount: userTokens[0].tokenCount,
        text,
      });

      await TokenService.updateTokenUsage({
        userId,
        tokensUsed: chatCompletion.usage?.total_tokens as number,
      });

      const chatResponse = chatCompletion.choices[0].message.content as string;

      userTokens = await TokenService.getTokenUsage({ userId });
      const newChat = await ChatsService.insertChat({
        userId: parseInt(userId),
        message: text,
        response: chatResponse,
      });

      socket.emit("get tokens", userTokens[0].tokenCount);

      socket.emit("chat message", newChat[0]);
    } catch (error) {
      const errorChat = await ChatsService.insertChat({
        userId: parseInt(userId),
        message: text,
        response: "You have exceeded your token limit. Please try again later.",
      });

      socket.emit("get tokens", 0);
      socket.emit("chat message", errorChat[0]);
      console.error((error as Error).message);
    }
  }
}

export default WsController;
