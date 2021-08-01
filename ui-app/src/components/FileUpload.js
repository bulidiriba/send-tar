import React, {useState} from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Divider from '@material-ui/core/Divider';
import CompareIcon from '@material-ui/icons/Compare';
import axios from 'axios';
import fileDownload from 'js-file-download'

function FileUpload(props) {

    const [selectedFile, setSelectedFile] = useState({file1: null, file2: null});
    const [errorSelectedFile, setErrorSelectedFile] = useState({file1: [false, ""], file2: [false, ""]});
    const [executedResult, setExecutedResult] = useState({error: [false, ""], success: [false, ""]});
    const [executedFile, setExecutedFile] = useState({fileName:null, filePath:null, fileSize:null, fileSizeMetric:null});

    const onFileChange = (fileIndex) => e => {
        console.log("file is uploading: ", fileIndex);
        const file = e.target.files[0];
        setSelectedFile(prevState => ({
            ...prevState,
            [fileIndex]: file
        }));
        const allowedFileType = /(\.csv|)$/i;
        console.log("allowed file type");
        if (!allowedFileType.exec(file)) {
            console.log("file type not passed");
            setErrorSelectedFile(prevState => ({
                ...prevState,
                [fileIndex]: [true, "This file type is not allowed"]
            }));
        } else {
            console.log("File type passed");
        }
    }
    const onFileUpload = () => {
        if(!selectedFile["file1"] && !selectedFile["file2"]){
            setExecutedResult({error: [true, "Please Select the files"], success: [false, ""]});
        } else {
            // create an object of form data
            const formData = new FormData();
            // append the first file
            formData.append(
                "file1",
                selectedFile["file1"],
                selectedFile["file1"].name
            );
            // append the second file
            formData.append(
                "file2",
                selectedFile["file2"],
                selectedFile["file2"].name
            );
            let url = "http://localhost:5000/upload_files"
            axios.post(url, formData, { 
            })
            .then(res => {
                console.warn("------Returned Result-------", res);
                setExecutedResult({success: [true, "File Executed successfully!"], error:[false, ""]});
                let result = res.data
                setExecutedFile({
                    fileName:result.file_name, 
                    filePath:result.file_path, 
                    fileSize:result.file_size, 
                    fileSizeMetric:result.file_size_metric
                });
            });  
        }
    }

    const downloadFile = () => {
        let url = "http://localhost:5000/download_file?file_path="+executedFile["filePath"]
        axios.get(url, {
            responseType: 'blob', // Important
        })
        .then((response) => {
            fileDownload(response.data, executedFile["fileName"]);
        });
    }

  return(
    <Box>
        <Grid container spacing={2}>
            <Grid item xs={2}></Grid>
            <Grid item xs={4}>
                <Card className={props.classes.fileUpload}>
                    <CardContent>
                        <Typography variant="h6" align="center" className={props.classes.info}>
                            File 1
                        </Typography>
                        <Divider light={true} />   
                        <Box align="center" pt={10}>
                            <Box>
                                <label htmlFor="upload-file1" >
                                <input 
                                    id="upload-file1" 
                                    type="file" 
                                    onChange={onFileChange("file1")} 
                                    style={{marginBottom:"20px", display: 'none'}}
                                />
                                <Button 
                                    color="secondary" 
                                    variant={"contained"} 
                                    component={"span"}
                                >Choose File
                                </Button>
                                </label>
                            </Box>
                            {selectedFile["file1"] && (
                                <Box>
                                    <Box pt={1} className={props.classes.info}>
                                        <Typography variant="body1">File Name: </Typography>
                                        <Typography variant="caption">{selectedFile["file1"]?.name}</Typography>                        
                                    </Box>
                                    <Box pt={1} className={props.classes.info}>
                                        <Typography variant="body1">File Type: </Typography>
                                        <Typography variant="caption">{selectedFile["file1"]?.type}</Typography>
                                    </Box>
                                </Box>
                            )} 
                            {errorSelectedFile["file1"][0] && (
                                <Box align="center" pt={1}>
                                    <Typography 
                                        variant="caption" 
                                        color="error"
                                    >{errorSelectedFile["file1"][1]}
                                    </Typography>
                                </Box>
                            )}
                        </Box>

                        <Box pt={10}></Box>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={4}>
                <Card className={props.classes.fileUpload}>
                    <CardContent>
                        <Typography 
                            variant="h6" 
                            align="center" 
                            className={props.classes.info}
                        >File 2
                        </Typography>
                        <Divider />
                        <Box align="center" pt={10}>
                            <Box>
                                <label htmlFor="upload-file2" >
                                <input 
                                    id="upload-file2" 
                                    type="file" 
                                    onChange={onFileChange("file2")} 
                                    style={{marginBottom:"20px", display: 'none'}}
                                />
                                <Button 
                                    color="secondary" 
                                    variant={"contained"} 
                                    component={"span"}
                                >Choose File
                                </Button>
                                </label>
                            </Box>
                            {selectedFile["file2"] && (
                                <Box>
                                    <Box pt={1} className={props.classes.info}>
                                        <Typography variant="body1">File Name: </Typography>
                                        <Typography variant="caption">{selectedFile["file2"]?.name}</Typography>                        
                                    </Box>
                                    <Box pt={1} className={props.classes.info}>
                                        <Typography variant="body1">File Type: </Typography>
                                        <Typography variant="caption">{selectedFile["file2"]?.type}</Typography>
                                    </Box>
                                </Box>
                            )} 
                            {errorSelectedFile["file2"][0] && (
                                <Box align="center" pt={1}>
                                    <Typography 
                                        variant="caption" 
                                        color="error"
                                    >{errorSelectedFile["file2"][1]}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                        <Box pt={10}></Box>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={2}></Grid>
        </Grid>
        
        <Box align="center" pt={4}>
            <Button
                variant="contained"
                color="secondary"
                style={{width:150, fontSize:15}}
                endIcon={<CompareIcon />}
                onClick={onFileUpload}
            >Execute
            </Button>
        </Box>
        

        {executedResult["error"][0] && (
            <Box align="center" pt={2}>
                <Typography 
                    variant="body2"
                    color="error"
                >{executedResult["error"][1]}
                </Typography>
            </Box>
        )}

        {executedResult["success"][0] && (
            <Box align="center" pt={2}>
                <Box>
                    <Typography 
                        variant="body2"
                        className={props.classes.success} 
                    >{executedResult["success"][1]}
                    </Typography>
                </Box>

                <Box>
                    <Typography 
                        variant="h6"
                        className={props.classes.info} 
                    >{executedFile["fileName"]}&nbsp;({executedFile["fileSize"]}{executedFile["fileSizeMetric"]})
                    </Typography>
                </Box>

                <Box>
                    <Link
                        component="button"
                        variant="body1"
                        color="secondary"
                        onClick={downloadFile}
                    >Download
                    </Link>
                </Box>
            </Box>
        )}
    </Box>
    )
}

export default FileUpload;
