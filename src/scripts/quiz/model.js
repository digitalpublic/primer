const uuidv4 = require('uuid/v4');



const Assets = [
    {
        text: "We maintain a written inventory of assets related to our project.",
        id: 1,
        category: "assets",
    },
    {
        text: "We update our asset inventory from time to time.",
        id: 2,
        dependencies: [1],
        category: "assets"
    },
    {
        text: "Each of our digital assets have someone responsible for managing and safeguarding them.",
        id: 3,
        category: "assets"
    },
    {
        text: "We have written, organization-wide practices for handling data and other project assets.",
        id: 4,
        category: "assets"
    },
    {
        text: "Our staff are regularly trained on data handling practices. These trainings are also part of employee onboarding.",
        id: 5,
        dependencies: [4],
        category: "assets"
    },
    {
        text: "We regularly update our data handling practices as our work evolves, and/or to match changing best practices.",
        id: 6,
        dependencies: [4],
        category: "assets"
    },
    {
        text: "The collection, use, and creation of our project's assets are all linked directly to project activities.",
        id: 7,
        category: "assets"
    },
    {
        text: "We collect only the data necessary to execute our project activities.",
        id: 8,
        dependencies: [7],
        category: "assets"
    },
    {
        text: "We limit secondary use of data that does not further the project's purpose, objectives, or activities",
        id: 9,
        dependencies: [8],
        category: "assets"
    },
    {
        text: "We track and regularly audit use of data and other digital assets, including new assets that may have been created via the project's activities.",
        id: 10,
        category: "assets"
    },
]


const Beneficiaries = [
    {
        text: "Our project has specific beneficiaries.",
        id: 1,
        category: "beneficiaries"
    },
    {
        text: "We regularly review the project to ensure that it continues to support beneficiary interests.",
        id: 2,
        dependencies: [1],
        category: "beneficiaries"
    },
    {
        text: "We regularly consult with beneficiaries on how the project affects them, and how their interests have evolved.",
        id: 3,
        dependencies: [1],
        category: "beneficiaries"
    },
    {
        text: "Beneficiaries are involved in every stage of the project, from day-to-day activities to oversight.",
        id: 4,
        dependencies: [1],
        category: "beneficiaries"
    },
    {
        text: "We prioritize beneficiary interests over other stakeholder interests.",
        id: 5,
        dependencies: [1],
        category: "beneficiaries"
    },
    {
        text: "We regularly review the benefits and risks of external stakeholder relationships.",
        id: 6,
        category: "beneficiaries"
    },
    {
        text: "Our external stakeholder relationships are built to minimize risks to the project and to limit behavior that may harm beneficiaries (e.g., expropriation of data).",
        id: 7,
        category: "beneficiaries"
    },
    {
        text: "We have a conflict of interest policy, and design our stakeholder relationships to minimize conflicts of interest between stakeholders and beneficiaries.",
        id: 8,
        category: "beneficiaries"
    }

]

const Management = [
    {
        text: "Each project activity has one or more stakeholders responsible for executing it, and each project objective has one or more stakeholders responsible for ensuring it is met.",
        id: 1,
        category: "management"
    },
    {
        text: "The project has a clear oversight structure that is separate from the day-to-day management of the project.",
        id: 2,
        category: "management"
    },
    {
        text: "It is clear when activities or conditions require escalation from day-to-day management to oversight.",
        id: 3,
        dependencies:[2],
        category: "management"
    },
    {
        text: "External stakeholders are held to equally stringent (or more stringent) management standards as internal stakeholders.",
        id: 4,
        category: "management"
    },
    {
        text: "The project's beneficiaries are involved in the management and oversight of the project.",
        id: 5,
        category: "management"
    },
    {
        text: "Beneficiaries have the power to change how the project operates.",
        id: 6,
        dependencies: [5],
        category: "management"
    },
    {
        text: "The project's management structure is transparent to the project stakeholders and beneficiaries.",
        id: 7,
        category: "management"
    },
]

const Permissions = [
    {
        text: "We have a list of permitted uses for data and digital assets.",
        id: 1,
        category: "permissions"
    },
    {
        text: "We also have a list of prohibited uses for data and digital assets.",
        id: 2,
        dependencies: [1],
        category: "permissions"
    },
    {
        text: "We also have a list of data uses that require additional permissions.",
        id: 3,
        dependencies: [1],
        category: "permissions"
    },
    {
        text: "We regularly review and update our data request permissions and processes.",
        id: 4,
        dependencies: [1],
        category: "permissions"
    },
    
    {
        text: "We have a process for handling a novel request for data or digital asset.",
        id: 5,
        category: "permissions"
    },
    {
        text: "We have developed principles that guide categorization of novel requests for data.",
        id: 6,
        dependencies: [5],
        category: "permissions"
    },
    {
        text: "Stakeholders and beneficiaries have a voice in approving requests for data or digital assets.",
        id: 7,
        category: "permissions"
    },
    {
        text: "We routinely audit past requests for data to ensure that the actual use did not exceed the scope of the initial request.",
        id: 8,
        category: "permissions"
    },
    {
        text: "We minimize access to data, so that internal and external parties only have sufficient access to execute a requested use.",
        id: 9,
        category: "permissions"
    },

]

const Purpose = [
    {
        text: "Our project has a written purpose that describes the project's high-level goals.",
        id: 1,
        category: "purpose"
    },
    {
        text: "Our project's purpose has a clear link to our organization's broader mission.",
        id: 2,
        dependencies:[1],
        category: "purpose"
    },
    {
        text: "Our project has supporting objectives related to the purpose.",
        id: 3,
        dependencies:[1],
        category: "purpose"
    },
    {
        text: "Our team has logically linked project activities to the objectives and purpose.",
        id: 4,
        dependencies:[1],
        category: "purpose"
    },
    {
        text: "All of our project activities are tied to objectives.",
        id: 5,
        dependencies:[4],
        category: "purpose"
    },
    {
        text: "We regularly review the project's progress against the purpose.",
        id: 6,
        dependencies:[1],
        category: "purpose"
    },
    {
        text: "We regularly review and update the project's purpose, objectives, and activities",
        id: 7,
        dependencies:[1],
        category: "purpose"
    },
    
]

const Risks = [
    {
        text: "We track project risks in a written risk register.",
        id: 1,
        category: "risks"
    },
    {
        text: "We actively maintain and review the risk register at least once a quarter.",
        id: 2,
        dependencies: [1],
        category: "risks"
    },
    {
        text: "We track risks related to the project and its assets; our organization; and the project's beneficiaries.",
        id: 3,
        category: "risks"
    },
    {
        text: "Our risk tracking includes both internal and external risk factors, including relationships with third party service providers.",
        id: 4,
        dependencies: [3],
        category: "risks"
    },
    {
        text: "We estimate each risk's likelihood of being realized, and each risk's severity if realized.",
        id: 5,
        dependencies: [3],
        category: "risks"
    },
    {
        text: "Each risk has specific mitigation measures, with an internal stakeholder responsible for maintaining each measure.",
        id: 6,
        dependencies: [3],
        category: "risks"
    },
    {
        text: "We escalate the handling of a risk to project leadership as its likelihood and severity increase.",
        id: 7,
        dependencies: [5],
        category: "risks"
    },
    {
        text: "Where relevant, project subgroups maintain their own risk registers, which are incorporated into the overall project register.",
        id: 8,
        dependencies: [3],
        category: "risks"
    },
]

const Quiz = {
        "assets": Assets,
        "beneficiaries": Beneficiaries,
        "management": Management,
        "permissions": Permissions,
        "purpose":Purpose,
        "risks": Risks,
}

export default Quiz