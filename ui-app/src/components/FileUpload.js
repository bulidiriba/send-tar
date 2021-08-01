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

// get the endpoint from enviroment
const apiEndpoint = process.env.REACT_APP_API_ENDPOINT
console.log("----flask rest api-----", apiEndpoint);

function FileUpload(props) {

    const [selectedFile, setSelectedFile] = useState({file1: null, file2: null});
    const [errorSelectedFile, setErrorSelectedFile] = useState({file1: [false, ""], file2: [false, ""]});
    const [executedResult, setExecutedResult] = useState({error: [false, ""], success: [false, ""]});
    const [executedFile, setExecutedFile] = useState({fileName:null, filePath:null, fileSize:null, fileSizeMetric:null});

    /**
     * Function to upload the file and save it as a state
     * @param {*} fileIndex 
     * @returns 
     */
    const onFileChange = (fileIndex) => e => {
        const file = e.target.files[0];
        // set the uploaded file to state
        setSelectedFile(prevState => ({
            ...prevState,
            [fileIndex]: file
        }));
        const allowedFileType = ["txt", "csv"]
        const fileExtension = file?.name.split(".").pop()
        if (allowedFileType.includes(fileExtension)) {
            setErrorSelectedFile(prevState => ({
                ...prevState,
                [fileIndex]: [false, ""]
            }));

            // remove the error displayed under executed button if its being displayed
            setExecutedResult({error: [false, ""], success: [false, ""]});
        } else {
            setErrorSelectedFile(prevState => ({
                ...prevState,
                [fileIndex]: [true, "Only .txt or .csv is allowed!"]
            }));
        }
    }
    
    /**
     * Function to make a request to rest api for execution
     * @param {*} fileIndex 
     * @returns 
     */
    const onFileUpload = () => {
        if(selectedFile["file1"] && selectedFile["file2"]){
            // check if the error occured on the file type or not
            if(errorSelectedFile["file1"][0] || errorSelectedFile["file2"][0]){
                setExecutedResult({error: [true, "File type not allowed!"], success: [false, ""]});
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
                let url = apiEndpoint+"/upload_files"
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
                })
                .catch(error => {
                    setExecutedResult({error: [true, "Error Occured: "+error.message], success: [false, ""]});
                    console.log("------------error: ", error);
                });
            }
        } else {
            setExecutedResult({error: [true, "Please Select the files"], success: [false, ""]});
        }
    }

    /**
     * Function to download the executed file
     */
    const downloadFile = () => {
        let url = apiEndpoint+"/download_file?file_path="+executedFile["filePath"]
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
                        <Box borderBottom={2} color="primary.background">
                            <Box color="primary.text">
                                <Typography 
                                    variant="h6" 
                                    align="center"
                                    >File 1
                                </Typography>
                            </Box>
                        </Box>
                        
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
                                    <Box pt={1} color="primary.text">
                                        <Typography variant="body1">
                                            File Name: 
                                        </Typography>
                                        <Typography variant="caption">
                                            {selectedFile["file1"]?.name}
                                        </Typography>                        
                                    </Box>
                                    <Box pt={1} color="primary.text">
                                        <Typography variant="body1">
                                            File Type: 
                                        </Typography>
                                        <Typography variant="caption">
                                            {selectedFile["file1"]?.type}
                                        </Typography>
                                    </Box>
                                </Box>
                            )} 
                            {errorSelectedFile["file1"][0] && (
                                <Box align="center" pt={1} color="primary.error">
                                    <Typography 
                                        variant="body2" 
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
                        <Box borderBottom={2} color="primary.background">
                            <Box color="primary.text">
                            <Typography 
                                variant="h6" 
                                align="center" 
                            >File 2
                            </Typography>
                            </Box>
                        </Box>
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
                                    <Box pt={1} color="primary.text">
                                        <Typography variant="body1">File Name: </Typography>
                                        <Typography variant="caption">{selectedFile["file2"]?.name}</Typography>                        
                                    </Box>
                                    <Box pt={1} color="primary.text">
                                        <Typography variant="body1">File Type: </Typography>
                                        <Typography variant="caption">{selectedFile["file2"]?.type}</Typography>
                                    </Box>
                                </Box>
                            )} 
                            {errorSelectedFile["file2"][0] && (
                                <Box align="center" pt={1} color="primary.error">
                                    <Typography 
                                        variant="body2" 
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
            <Box align="center" pt={2} color="primary.error">
                <Typography 
                    variant="body1"
                >{executedResult["error"][1]}
                </Typography>
            </Box>
        )}

        {executedResult["success"][0] && (
            <Box align="center" pt={2}>
                <Box color="primary.success">
                    <Typography 
                        variant="body1"
                    >{executedResult["success"][1]}
                    </Typography>
                </Box>

                <Box color="primary.text">
                    <Typography 
                        variant="h6"
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
