import {useState} from "react";
import {SideMenu} from "../../components/SideMenu";
import {Project} from "../../core/Project";
import {ApiKeysSettings} from "./ApiKeysSettings";
import {TagsSettings} from "./TagsSettings";

interface SettingsTabProps {
	project: Project
	onUpdate: () => void
}

export default function SettingsTab({project, onUpdate}: SettingsTabProps) {
	const [menuIndex, setMenuIndex] = useState(0)

	const panels = [
		{
			label: "General",
			renderer: <div>General</div>
		},
		{
			label: "Tags",
			renderer: <TagsSettings project={project} onUpdate={onUpdate}/>
		},
		{
			label: "Api keys",
			renderer: <ApiKeysSettings project={project}/>
		}
	]

	return (
		<div className="flex-1 f-r gap-4">
			<SideMenu
				items={panels}
				onChange={setMenuIndex}
			/>
			<div className="flex-1">{panels[menuIndex].renderer}</div>
		</div>
	)
}
