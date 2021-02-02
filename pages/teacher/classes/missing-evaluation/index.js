import React, { useState, useEffect, useRef } from 'react';
import Pagination from 'react-js-pagination';
import { getLayout } from '~/components/Layout';
import Skeleton from 'react-loading-skeleton';
import { getMissingFeedback } from '~/api/teacherAPI';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dataHy from '../../../../data/data.json';
import { i18n, withTranslation } from '~/i18n';
console.log('o ngoai', dataHy.MissingEvaluationClasses);

function getData() {
	const andt = dataHy.MissingEvaluationClasses;
	return andt;
}
const MissingFeedbackRow = ({ data }) => {
	const {
		BookingID,
		ScheduleTimeVN,
		ScheduleTimeUTC,
		DocumentName,
		LessionName,
		EvaluationStatus,
	} = data;
	return (
		<tr>
			<td className="clr-time">
				<div className="mg-b-5">
					<span className=" mg-r-5 tx-nowrap wd-80 d-inline-block">
						<FontAwesomeIcon icon="clock" className="fa fa-clock tx-primary" />{' '}
						<span className="tx-medium">VN time</span>:
					</span>
					<span className="">{data.ScheduleTimeVN}</span>
				</div>
				<div className="">
					<span className=" mg-r-5 tx-nowrap wd-80 d-inline-block">
						<FontAwesomeIcon icon="clock" className="fa fa-clock tx-primary" />{' '}
						<span className="tx-medium">Your time</span>:
					</span>
					<span className="">{data.ScheduleTimeUTC}</span>
				</div>
			</td>
			<td className="clr-lesson">
				<div className="mg-b-5">
					<span className=" mg-r-5 tx-medium">Course:</span>
					<span className="">{data.DocumentName}</span>
				</div>
				<div className="">
					<span className=" mg-r-5 tx-medium">Lesson:</span>
					<span className="">{data.LessionName}</span>
				</div>
			</td>
			<td className="clr-feedbackStatus">
				<div className="mg-b-5">
					{/* {data.EvaluationStatus === 1 ? (
						<span className="tx-danger">Not feedback</span>
					) : ( */}

					<span className="tx-success">{data.EvaluationStatus}</span>
				</div>
			</td>
			<td className="clr-actions">
				<Link href={`/teacher/evaluation/edit/${data.BookingID}`}>
					<a href={true} className="btn btn-sm btn-secondary rounded-5">
						<FontAwesomeIcon
							icon="file-signature"
							className="fas fa-file-signature clrm-icon"
						/>{' '}
						Evaluate
					</a>
				</Link>
			</td>
		</tr>
	);
};

const MissingFeedbackClasses = ({ t }) => {
	const [isLoading, setIsLoading] = useState(true);
	const [pageNumber, setPageNumber] = useState(1);
	const [data, setData] = useState(null);
	const [pageSize, setPageSize] = useState(0);
	const [totalResult, setTotalResult] = useState(0);

	const loadMissingFeedback = async () => {
		try {
			const res = await getMissingFeedback({ Page: pageNumber });
			if (res?.Code && res.Code === 1) {
				setData(res.Data);
				setPageSize(res.PageSize);
				setTotalResult(res.TotalResult);
			} else {
				console.log('Code response khác 1');
			}
			setIsLoading(false);
		} catch (error) {
			console.log(error);
			setIsLoading(false);
		}
	};

	const layData = getData();
	console.log('tu hy', layData);

	useEffect(() => {
		loadMissingFeedback();
	}, [pageNumber]);

	return (
		<>
			<h1 className="main-title-page">{t('missing-evaluation-classes')}</h1>
			<div className="card">
				<div className="card-body">
					<>
						<div className="table-responsive ">
							<table className="table table-classrooms table-borderless responsive-table table-hover">
								<thead className="">
									<tr className="">
										<th className="clr-time">{t('schedule')}</th>
										<th className="clr-lesson">{t('lesson')}</th>
										<th className="clr-feedbackStatus">
											{t('student-feedback')}{' '}
										</th>
										<th className="clr-actions">{t('actions')}</th>
									</tr>
								</thead>
								{/*1 item*/}
								<tbody>
									{isLoading ? (
										<>
											<tr>
												<td>
													<Skeleton />
												</td>
												<td>
													<Skeleton />
												</td>
												<td>
													<Skeleton />
												</td>
												<td>
													<Skeleton />
												</td>
											</tr>
											<tr>
												<td>
													<Skeleton />
												</td>
												<td>
													<Skeleton />
												</td>
												<td>
													<Skeleton />
												</td>
												<td>
													<Skeleton />
												</td>
											</tr>
											<tr>
												<td>
													<Skeleton />
												</td>
												<td>
													<Skeleton />
												</td>
												<td>
													<Skeleton />
												</td>
												<td>
													<Skeleton />
												</td>
											</tr>
										</>
									) : !!layData && !!layData.length > 0 ? (
										layData.map((item) => (
											<MissingFeedbackRow
												key={`${item.BookingID}`}
												data={item}
											/>
										))
									) : (
										<tr className="bg-white-f">
											<td colSpan={4}>
												<div className="empty-error tx-center mg-t-30 bg-white mg-x-auto">
													<img
														src="/static/img/no-data.svg"
														alt="no-booking"
														className="wd-200 mg-b-15"
													/>
													<p className=" tx-danger tx-medium">
														Greate, all courses are evaluated.
													</p>
												</div>
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>

						{totalResult > pageSize && (
							<Pagination
								innerClass="pagination mg-t-15"
								activePage={pageNumber}
								itemsCountPerPage={pageSize}
								totalItemsCount={totalResult}
								pageRangeDisplayed={5}
								onChange={(page) => setPageNumber(page)}
								itemClass="page-item"
								linkClass="page-link"
								activeClass="active"
							/>
						)}
					</>
				</div>
			</div>
		</>
	);
};

// MissingFeedbackClasses.getLayout = getLayout;
// export default MissingFeedbackClasses;

MissingFeedbackClasses.getLayout = getLayout;
MissingFeedbackClasses.getInitialProps = async () => ({
	namespacesRequired: ['common'],
});
export default withTranslation('common')(MissingFeedbackClasses);
