import Preview from '@components/Preview';
import Circle from '@models/Circle';
import { AppState } from '@store/app/types';
import React from 'react';
import { connect } from 'react-redux';

interface PreviewPageProps {
  circle: Circle;
}

const PreviewPage: React.FC<PreviewPageProps> = ({ circle }) => <Preview circle={circle} />;
const mapStateToProps = (state: AppState): PreviewPageProps => ({
  circle: state.circles[0],
});

export default connect(mapStateToProps)(PreviewPage);
