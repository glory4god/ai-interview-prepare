import { Border, BoxRow, Container, Spacing } from 'mainlib/components';
import { Top3 } from 'mainlib/components/Top';
import { colors } from 'mainlib/constants/colors';
import { useRouter } from 'next/router';

export default function IndexPage() {
  const { push } = useRouter();

  return (
    <div className="bg-white">
      <Spacing size={20} />
      <Top3 color={colors.gray900}>{`AI Interview Prepare!`}</Top3>
      <Spacing size={48} />
      <Border size={16} />
      <Spacing size={8} />
      <Container>
        <BoxRow onClick={() => push('/front-end')}>FrontEnd</BoxRow>
        <BoxRow onClick={() => push('/back-end')}>BackEnd</BoxRow>
      </Container>
    </div>
  );
}
