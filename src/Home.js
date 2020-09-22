import React, { useEffect, useState } from 'react'
import "./Home.css"
import * as XLSX from 'xlsx';
import excelFile from './parse_test_sheet.xlsx'

function DataCell(props)
{
    return (
        <>
            <td>{props.cellValue}</td>
        </>
    );
}


function DataRow(props)
{

    const [checkedBoxesCount,setCheckedBoxesCount] = useState(0);

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

    function approveOrRejectObject(row,action)
    {
        let obj = new Object();
        
        for(let i=0;i<props.heading[0].length;i++)
        {
            let headingKey = props.heading[0][i];
            obj[headingKey] = row.children[i+1].innerHTML;
        }
        obj.action = action;
        return obj
    }

    function handleApprove(e)
    {
        let allCheckBoxes = document.getElementsByClassName("row-select");
        let allApprovedObjects = []
        for(let i=0;i<allCheckBoxes.length;i++)
        {
            if(allCheckBoxes[i].checked == true)
            {
                let approvedObject = approveOrRejectObject(allCheckBoxes[i].parentElement.parentElement,e.target.innerHTML);
                allApprovedObjects.push(approvedObject);
            }
        }
        console.log(allApprovedObjects);
    }

    // function handleApproveAll(e)
    // {
    //     let allCheckedBoxes = document.getElementsByClassName("row-select");
    //     let allApprovedObjects = []
    //     for(let i=0;i<allCheckedBoxes.length;i++)
    //     {
    //         let approvedObject = approveOrRejectObject(allCheckedBoxes[i].parentElement.parentElement,e.target.innerHTML);
    //         allApprovedObjects.push(approvedObject);
    //     }
    //     console.log(allApprovedObjects);
    // }

    function handleReject(e)
    {

        // let obj = approveOrRejectObject(e.target.parentElement.parentElement,e.target.innerHTML);
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
                        <td>Select</td>
                        {props.rowArray.map(cellValue=><DataCell cellValue={cellValue}/>)}
                        <td>Action</td>
                    </tr>
                </>
            ):(
                <>
                    <tr>
                        <td><input type="checkbox" className = "row-select" onChange={handleChecked}/></td>
                        {props.rowArray.map(cellValue=><DataCell cellValue={cellValue}/>)}
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


    function handleApproveAll()
    {
        
    }


    let data1 = [[8888888888,1,1000],[9999999999,2,500]];

    return (
        <div>
            <table>
                {excelData.map((rowArray,index)=><DataRow rowArray={rowArray} index={index} heading={excelDataHeading} />)}
            </table>
            <br/>
            <button id="approve-multiple-button" disabled={true} onClick={handleApproveAll}>Approve</button>
        </div>
    );
}

export default Home;