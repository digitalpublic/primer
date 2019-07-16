import m from "mithril"
import localforage from "../common/storage"
import keys from "ramda/src/keys"
import length from "ramda/src/length"
import Sortable from "sortablejs"
import move from "ramda/src/move"
const uuidv4 = require('uuid/v4');

const Model = {
    beneficiaries: [],
    stakeholders: {},

    addBeneficiary: ()=>{
        const keyCount = length(keys(Model.beneficiaries))
        const content = "";
        const uid = uuidv4()
        Model.beneficiaries.push({sort: keyCount, content: content, id: uid})
        localforage.setItem("beneficiaries", Model.beneficiaries)
    },
    updateBeneficiary: (index, content)=>{
        Model.beneficiaries[index].content = content
        localforage.setItem("beneficiaries", Model.beneficiaries)
    },

    resortBeneficiaries: (oldIndex, newIndex)=>{
        const oldOrder = Model.beneficiaries
        const newOrder = move(oldIndex, newIndex, oldOrder)
        Model.beneficiaries = newOrder
        localforage.setItem("beneficiaries", newOrder)
        m.redraw()
    },

    removeBeneficiary: (index)=>{
        const oldSet = Model.beneficiaries
        const newSet = remove(index, 1, oldSet)
        Model.beneficiaries = newSet
        localforage.setItem("beneficiaries", newSet)
    },


    addStakeholder: ()=>{
        const content = "";
        const uid = uuidv4()
        Model.stakeholders[uid] = {content: content, benefits: []}
        localforage.setItem("beneficiaries", Model.beneficiaries)
    },

    updateStakeholder: ()=>{
        const content = "";
        const uid = uuidv4()
        Model.stakeholders[uid] = {content: content, benefits: []}
        localforage.setItem("beneficiaries", Model.beneficiaries)
    },

    addBenefit: ()=>{

    },

    updateBenefit:()=>{

    }
}




const beneficiaryListView = {
    oncreate: (vnode)=>{
        var sortable = Sortable.create(vnode.dom, {
            handle: ".handle",
            onEnd: function (/**Event*/evt) {
                var itemEl = evt.item;  // dragged HTMLElement
                Model.resortBeneficiaries(evt.oldDraggableIndex, evt.newDraggableIndex) // element's new index within new parent
            },
        });
    },
    view: (vnode)=>{
        return m("div",[
            vnode.attrs.beneficiaries.map(function(beneficiary, index){
                return m(beneficiaryView, {key: beneficiary.id, content: beneficiary.content, index:index})
            }),
        ])
    }
}

const beneficiaryView = {
    oncreate:(vnode)=>{

    },
    
    view: (vnode)=>{
        return m("div", {class:"pa2 mv2 flex"}, [
            m("div", {class:"mr2 f4 pr2 pv2 lato b navy"}, `${vnode.attrs.index+1}. `),
            m("input", {class:"input-reset border-box bn mw10 br2 f4 pa2 lato navy", style:"background-color: rgba(205, 236, 255, 0.5); resize: none", oninput: (e)=>{Model.updateBeneficiary(vnode.attrs.index, e.target.value)}, value: vnode.attrs.content}),
            m("i", {class:"fas f3 pv2 pl2 navy mh2 handle fa-arrows-alt-v pointer"}),
            m("i", {class:"fas f3 pv2 pl2 navy mh2 handle fa-trash hover-red pointer", onclick:()=>{Model.removeBeneficiary(vnode.attrs.index)}})

        ])
    }
}


const MainView = {
    view: ()=>{
        return m("div", [
            m("p",{class:"f3 b mt5 navy"}, "Our project's beneficiaries are:"),
            
            m("button", {class:"button-reset pointer bg-blue white bn br2 lato b f5 pa2", onclick:()=>{Model.addBeneficiary()}}, "Add Beneficiary"),
            m(beneficiaryListView, {beneficiaries: Model.beneficiaries}),

            m("p", {class:"f3 b mt5 navy"}, "Our project's other stakeholders are:")
        ])
    }
}
localforage.ready().then(function(){

    localforage.getItem('beneficiaries').then(function(value) {
        console.log(value)
        Model.beneficiaries = value === null ? [] : value

      //  localforage.getItem('objectives').then(function(value) {
       //     Model.objectives = value === null ? {} : value
       //     console.log(Model.objectives)
            m.mount(document.getElementById("exercise"), MainView)
      //  }).catch(function(err) {
            // This code runs if there were any errors
        //    console.log(err);
       // });

    }).catch(function(err) {
        // This code runs if there were any errors
        console.log(err);
    });

    
})
