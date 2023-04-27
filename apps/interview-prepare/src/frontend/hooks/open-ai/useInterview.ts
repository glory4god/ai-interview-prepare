import { useCallback, useState, useMemo } from 'react';

import { fetcher } from '@/frontend/lib/apis/fetcher';

interface InterviewProps {
  job: '프론트엔드' | '백엔드';
  makeQuestion: (str?: string) => ChatAIInit;
}

export const defaultModel: ChatAIInit = {
  messages: [],
  model: 'gpt-3.5-turbo-0301',
  max_tokens: 1024,
  temperature: 0.7,
  presence_penalty: 0,
  frequency_penalty: 0,
  top_p: 1,
};
type interviewTypes = 'frontend' | 'backend';

const INTERVIEW_MAPPER: { [key in interviewTypes]: InterviewProps } = {
  frontend: {
    job: '프론트엔드',
    makeQuestion: (str?: string) => ({
      ...defaultModel,
      messages: [
        {
          role: 'user',
          name: 'interviewer',
          content: str
            ? str
            : `나는 프론트엔드 개발자 면접 준비를 하고 있어
            React 또는 Javascript에서 질문 1개를 아래 양식처럼 내줘
            Q. 문제
            `,
        },
      ],
    }),
  },
  backend: {
    job: '백엔드',
    makeQuestion: (str?: string) => ({
      ...defaultModel,
      messages: [
        {
          role: 'user',
          name: 'interviewer',
          content: str
            ? str
            : `나는 백엔드 개발자 면접 준비를 하고 있어
            Computer Science 또는 Java Spring에서 질문 1개를 아래 양식처럼 내줘
            Q. 문제
            `,
        },
      ],
    }),
  },
} as const;

export default function useInterview({ type }: { type: interviewTypes }) {
  const [chattings, setChattings] = useState<Chatting[]>([]);
  const [question, setQuestion] = useState<Chatting>();
  const [loading, setLoading] = useState(false);

  const INTERVIEWER = useMemo(() => INTERVIEW_MAPPER[type], [type]);

  const postChatGPT = useCallback(async (query: ChatAIInit) => {
    try {
      const res = await fetcher<Chatting>(`/openai/interview`, {
        method: 'POST',
        body: JSON.stringify(query),
      });
      setLoading(false);
      return res;
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  }, []);

  const makeNewQuestion = useCallback(
    async (str?: string) => {
      const q = await postChatGPT(INTERVIEWER.makeQuestion(str));
      setQuestion(q);
    },
    [INTERVIEWER, postChatGPT],
  );

  const postAnswer = useCallback(
    async (query: ChatAIInit) => {
      if (!query.messages?.length) return;
      setLoading(true);

      const chat = query.messages[0].content;
      query.messages[0].content = convertInterviewForm(question?.chat!, query);

      const answer = await postChatGPT(query);
      setLoading(false);
      if (!answer) return;

      setChattings((prev) => [
        ...prev,
        {
          writer: 'me',
          time: new Date().toString(),
          id: new Date().getTime(),
          chat,
        },
        answer,
      ]);
    },
    [postChatGPT, question],
  );

  const giveupQuestion = useCallback(
    async (query: ChatAIInit) => {
      setLoading(true);
      const chat = query.messages[0].content;
      query.messages[0].content = convertInterviewGiveupForm(
        question?.chat!,
        query,
      );

      const answer = await postChatGPT(query);
      setLoading(false);
      if (!answer) return;

      setChattings((prev) => [
        ...prev,
        {
          writer: 'me',
          time: new Date().toString(),
          id: new Date().getTime(),
          chat,
        },
        answer,
      ]);
    },
    [postChatGPT, question],
  );
  return {
    question,
    chattings,
    postAnswer,
    loading,
    makeNewQuestion,
    giveupQuestion,
  };
}

const convertInterviewForm = (question: string, query: ChatAIInit) => {
  return `문제 : ${question}
  답변 : ${query.messages[0]?.content}
  
  아래 양식에 따라 답변해주세요.
  [ 정답 : 정답여부!(정답률 표기)

    이유 :
    
    추가설명 :
  ]`;
};

const convertInterviewGiveupForm = (question: string, query: ChatAIInit) => {
  return `문제 : ${question}
  
  문제에 대한 정답을 자세히 알려줘!?
  `;
};
