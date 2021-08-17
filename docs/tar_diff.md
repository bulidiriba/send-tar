**TAR DIFF TOOL**

Executing file with Tar Diff App

<u>**Step 1**: 'Home Page'</u>

![](./screenshots/home.png)


<u>**Step 2**: 'Choose Local Location'</u>

For now the `local_location.txt` is available in the send_scripts.zip file

![](./screenshots/local_location.png)


<u>**Step 3**: 'Choose SW Location'</u>

For now the `sw_location.txt` is available in the send_scripts.zip file

![](./screenshots/sw_location.png)




<u>**Step 4**: 'Click Execute button'</u>

<u>**Step 5**: 'Returned Result'</u>

If the file executed successfully then the result and executed file returned as `hashes.csv` with its size  as following

![](./screenshots/result.png)

<u>**Step 6**: 'Download File'</u>

To download the returned file, click the `download` link

<u>**Step 7**: 'Downloaded File'</u>

With current `local_location.txt` and `sw_location.txt` the returned file looks like the following

![](./screenshots/hashes.png)


**ERROR**

<u>**1**: 'If File Wrongly Selected'</u>

The first file to be selected is the Local Location, but if the SW Location or other file is
selected as Local Location, then the error will occur while execution.

![](./screenshots/error1.png)

<u>**2**: 'If file type out of .txt or .csv selected'</u>

The app supports only `.txt` and `.csv` file types. If the file out this type gets selected
then the error will occur.

![](./screenshots/error2.png)


<u>**3**: 'If API is not available'</u>

![](./screenshots/error3.png)