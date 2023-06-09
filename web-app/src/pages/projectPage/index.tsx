import {CogIcon} from "@heroicons/react/outline";
import {ChangeEvent, useCallback, useContext, useEffect, useState} from "react";
import {Link, Navigate, useNavigate, useParams} from "react-router-dom";
import {Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {Api, ApiContext, useApi} from "../../api"
import Button from "../../components/Button";
import Card from "../../components/Card";
import Chart from "../../components/Chart";
import {ProjectSideBar } from "../../components/ProjectSideBar";
import Select from "../../components/Select";
import SideBar from "../../components/SideBar";
import Tabs from "../../components/Tabs";
import {ApiKey} from "../../core/ApiKey";
import {Log} from "../../core/Log";
import {Metric} from "../../core/Metric";
import {Project} from "../../core/Project";
import {View} from "../../core/View";
import {useModal} from "../../services/ModalService";
import {DashboardView, OrganizeDashboardForm} from "./forms/OrganizeDashboardForm";
import LogsTab from "./LogsTab";
import {MetricsPanel} from "./MetricsPanel";
import SettingsTab from "./SettingsTab";

export default function ProjectPage() {
	
	const api = useApi();
	const modalService = useModal();
	const navigate = useNavigate()
	const {projectId} = useParams();
	const [errorMessage, setErrorMessage] = useState<null | string>(null);
	const [project, setProject] = useState<Project | null>(null);
	const [logs, setLogs] = useState<Log[]>([]);
	const [metrics, setMetrics] = useState<Metric[]>([]);
	const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
	const [dashboardConfig, setDashboardConfig] = useState<View<DashboardView> | null>(null)

	const fetchProject = useCallback(async () => {
		const project = await api.fetchProject(projectId as string);
		setProject(project);
		const logs = await api.fetchProjectLogs(projectId as string);
		setLogs(logs);
		const metrics = await api.fetchProjectMetrics(projectId as string);
		setMetrics(metrics);
		const apiKeys = await api.fetchProjectApiKeys(projectId as string);
		setApiKeys(apiKeys);
		const dashboardConfig = await api.fetchDashboardView(project.id)
		setDashboardConfig(dashboardConfig)
	}, [projectId, api])

	useEffect(() => {fetchProject()}, [fetchProject])

	if (!project) {
		return <div>Loading project...</div>
	}

	const onSaveDashboard = async (dashboard: DashboardView) => {
		if (!dashboardConfig) {
			await api.createView(project.id, {
				provider: "Web",
				type: "dashboard",
				name: "dashboard",
				config: dashboard
			})
			return fetchProject();
		}
		await api.updateView(project.id, dashboardConfig, {name: "dashboard", config: dashboard});
		fetchProject();
	}

	return (
		<div className="flex-1 f-r h-full overflow-hidden">
			<div className="flex-1 f-c gap-2 overflow-hidden">
				<div className="f-r justify-center items-center gap-2 px-1">
					<h2 className="text-xl">Dashboard</h2>
					<CogIcon
						className="w-4 h-4 cursor-pointer"
						onClick={async () => {modalService.addModal((close) =>
							<OrganizeDashboardForm
								metrics={metrics}
								dashboard={dashboardConfig}
								close={close}
								onSave={onSaveDashboard}
							/>
						)}}
					/>
				</div>
				<MetricsPanel metrics={metrics} dashboardConfig={dashboardConfig}/>
				<div className="flex-1 f-r gap-2 overflow-hidden">
					<LogsTab
						className="flex-1 overflow-scroll"
						project={project}
						logs={logs}
					/>
					<div className="flex-1 f-c gap-2 overflow-scroll">
							{(dashboardConfig?.config.charts || []).map(chart => {
								const data = chart.metrics.map(line => {
									const metric = metrics.find(metricc => metricc.id === line.metricId)
									return {
										name: metric?.name || "default",
										type: line.type,
										color: line.color !== '' ? line.color : "red",
										alwaysUseLastValue: line.alwaysUseLastValue,
										data: (metric?.history || []).map(metricHistory => {
											return {value: metricHistory.value, date: metricHistory.date}
										})
									}
									

								})

								return (
									<Card className="flex-1 f-c">
										<div className="f-r justify-center gap-8">
											{chart.metrics.map(metricChart => {
												const metric = metrics.find(metric => metric.id === metricChart.metricId)
												return <div className="f-r items-center gap-2" style={{color: metricChart.color}}><span className="text-3xl">{metric?.currentValue}</span> {metric?.name}</div>
											})}
										</div>
										<div className="flex-1">
											<Chart charts={data}/>
										</div>
									</Card>
								)
							})}
					</div>
				</div>
			</div>
		</div>
	)
}


