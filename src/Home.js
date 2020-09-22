import React, { useEffect, useState } from 'react'
import "./Home.css"
import * as XLSX from 'xlsx';
import excelFile from './parse_test_sheet.xlsx'
import RemarkModal from './RemarkModal';

function approveOrRejectObject(heading,row,action)
{
    let obj = {};
    
    for(let i=0;i<heading[0].length;i++)
    {
        let headingKey = heading[0][i];
        obj[headingKey] = row.children[i+1].innerHTML;
    }
    obj.action = action;
    return obj;
}

function approveAll(heading)
{
    let allCheckBoxes = document.getElementsByClassName("row-select");
    let allApprovedObjects = []
    for(let i=0;i<allCheckBoxes.length;i++)
    {
        if(allCheckBoxes[i].checked === true)
        {
            let approvedObject = approveOrRejectObject(heading,allCheckBoxes[i].parentElement.parentElement,"Approve");
            allApprovedObjects.push(approvedObject);
        }
    }
    console.log(allApprovedObjects);
}

// This will populate each row in the table
function DataRow(props)
{

    const [checkedBoxesCount,setCheckedBoxesCount] = useState(0);  // If no boxes are checked, Approve Selected will be disabled

    useEffect(()=>{
        if(checkedBoxesCount)
        {
            document.getElementById("approve-multiple-button").disabled = false;
        }
        else
        {
            document.getElementById("approve-multiple-button").disabled = true;
        }
    },[checkedBoxesCount])

    function handleApprove(e)
    {
        let approvedObject = approveOrRejectObject(props.heading,e.target.parentElement.parentElement,e.target.innerHTML);
        console.log(approvedObject);
    }

    function handleReject(e)
    {
        let rejectedObject = approveOrRejectObject(props.heading,e.target.parentElement.parentElement,e.target.innerHTML);
        props.showEnterRemark(rejectedObject);
    }

    function handleChecked(e)
    {
        if(e.target.checked)
        {
            setCheckedBoxesCount(checkedBoxesCount+1);
        }
        else
        {
            setCheckedBoxesCount(checkedBoxesCount-1);
        }
    }

    return (
        <>
            {(props.index===0)?(
                <>
                    <tr>
                        <th>Select</th>
                        {props.rowArray.map((cellValue,index)=><th key={index}>{cellValue}</th>)}
                        <th>Action</th>
                    </tr>
                </>
            ):(
                <>
                    <tr>
                        <td><input type="checkbox" className = "row-select" onChange={handleChecked}/></td>
                        {props.rowArray.map((cellValue,index)=><td key={index}>{cellValue}</td>)}
                        <td><button onClick={handleApprove}>Approve </button>  <button onClick={handleReject}>Reject</button></td>
                    </tr>
                </>
            )}
        </>
    )
}

function Home()
{

    const [excelDataHeading,setExcelDataHeading] = useState([]);   
    const [excelData,setExcelData] = useState([]);
    const [enterRemark,setEnterRemark] = useState(false);           // If this is true, show a view to enter remark
    const [rejectedObject,setRejectedObject] = useState("");        

    // Used to parse excel data on initial mount
    useEffect(()=>{
        fetch(excelFile)
        .then(res=>res.blob())
        .then(f=>{
            var reader = new FileReader();
            reader.onload = function (e) {
                var data = e.target.result;
                let readedData = XLSX.read(data, {type: 'binary'});
                const wsname = readedData.SheetNames[0];
                const ws = readedData.Sheets[wsname];
                const dataParse = XLSX.utils.sheet_to_json(ws, {header:1});
                setExcelDataHeading(dataParse.slice(0,1));
                setExcelData(dataParse);
            };
            reader.readAsBinaryString(f)
        })
    },[]);

    // Will be called when click on Reject
    function showEnterRemark(rejectedObject)
    {
        setRejectedObject(rejectedObject);
        setEnterRemark(true);
    }

    // Will be called when we enter Remark
    function handleFinalReject(buttonClicked,remark)
    {
        if(buttonClicked==="Reject")
        {
            const obj = rejectedObject;
            obj.remark = remark;
            setRejectedObject(obj);
            console.log(rejectedObject);   
        }
        setEnterRemark(false);
    }

    function handleApproveAll()
    {
        approveAll(excelDataHeading);
    }

    return (
        <div>
            <table>
                <tbody>
                    {excelData.map((rowArray,index)=><DataRow rowArray={rowArray} index={index} heading={excelDataHeading} showEnterRemark={showEnterRemark} key={index}/>)}
                </tbody>
            </table>
            <br/>
            <button id="approve-multiple-button" onClick={handleApproveAll}>Approve Selected</button>
            {(enterRemark) && <RemarkModal id={rejectedObject.earning_id} handleFinalReject={handleFinalReject}/> }
        </div>
    );
}

export default Home;