import Preview from '@components/Preview';
import Circle from '@models/Circle';
import { AppState } from '@store/app/types';
import { noop } from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';

interface PreviewPageParams {
  id: string;
}

interface StateToProps {
  circles: Circle[];
}

type PreviewPageProps = StateToProps & RouteComponentProps;

const PreviewPage: React.FC<PreviewPageProps> = (props) => {
  const { circles, match } = props;
  const params = match.params as PreviewPageParams;
  const id = parseInt(params.id, 10) - 1;
  return <Preview circle={circles[id]} onClose={noop} />;
};

const mapStateToProps = (state: AppState): StateToProps => ({
  circles: state.circles,
});

export default connect(mapStateToProps)(PreviewPage);
