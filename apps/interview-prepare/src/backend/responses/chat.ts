import { CreateChatCompletionResponse } from 'openai';

export const returnChatCompletionMode = (
  init: CreateChatCompletionResponse,
) => {
  return {
    writer: init.choices[0].message?.role,
    chat: init.choices[0].message?.content,
    time: new Date(),
    id: new Date().getTime(),
  };
};
