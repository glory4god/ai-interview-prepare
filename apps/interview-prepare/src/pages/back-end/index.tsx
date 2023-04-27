import {
  Border,
  Button,
  FixedBottomButton,
  Spacing,
  Text,
  TextArea,
} from 'mainlib/components';
import { Top3 } from 'mainlib/components/Top';
import { colors } from 'mainlib/constants/colors';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect } from 'react';
import { Form } from 'ui/Layout';

import { ChatSkeleton, Header } from '@/frontend/components';
import { Chattings } from '@/frontend/components/Chat';
import { useInterview, useForm } from '@/frontend/hooks';
import { defaultModel } from '@/frontend/hooks/open-ai/useInterview';

export default function BackEndPage() {
  const { push } = useRouter();
  const {
    question,
    makeNewQuestion,
    chattings,
    loading,
    postAnswer,
    giveupQuestion,
  } = useInterview({
    type: 'backend',
  });

  const { form, setForm } = useForm(defaultModel);

  const onMessageChange = useCallback((val: string) => {
    setForm((p) => ({
      ...p,
      messages: [{ role: 'user', name: 'me', content: val }],
    }));
  }, []);

  const onSubmit = useCallback(() => {
    postAnswer(form).then((r) => onMessageChange(''));
  }, [form, postAnswer, onMessageChange]);

  const onGiveup = useCallback(() => {
    giveupQuestion(form).then((r) => onMessageChange(''));
  }, [form, giveupQuestion, onMessageChange]);

  useEffect(() => {
    makeNewQuestion();
  }, []);

  return (
    <>
      <Header onBackClick={() => push('/')} />
      <div className="bg-white">
        <Top3 color={colors.gray900}>{`Frontend Interview`}</Top3>
        <Spacing size={32} />
        <Border size={8} />
        <Form>
          <Spacing size={16} />
          <Text typography="T4">Question!</Text>
          <br />
          <Text typography="T6">{question?.chat}</Text>
          <Chattings chattings={chattings} />
          {loading ? (
            <ChatSkeleton />
          ) : (
            <>
              <Spacing size={16} />
              <Text className="pr-2" typography="T4">
                Answer!
              </Text>{' '}
              <Button size="small" onClick={onGiveup}>
                정답확인하기
              </Button>
              <Spacing size={8} />
              <TextArea
                rows={5}
                value={form.messages[0]?.content}
                onChange={(e) => onMessageChange(e.target.value)}
              />
            </>
          )}
        </Form>
        <Spacing size={16} />
        <FixedBottomButton
          disabled={loading || !form.messages[0]?.content?.length}
          onClick={onSubmit}>
          Submit
        </FixedBottomButton>
      </div>
    </>
  );
}
