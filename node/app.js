const express = require("express");
var cors = require("cors");

const app = express();
app.use(cors());
const port = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/task/list", (req, res) => {
  console.log(req.body);
  return res.status(200).json({
    status: "OK",
    result: {
      records: [
        {
          name: "input",
          type: 98,
          inputParams: [],
          outputParams: [
            {
              type: "File",
              label: "gtc_tsv"
            }
          ]
        },
        {
          name: "output",
          type: 99,
          inputParams: [
            {
              type: "String",
              label: "output"
            }
          ],
          outputParams: []
        },

        {
          toolId: "0bfb63b456b94bdd84a8d3fd57d08645",
          name: "cnvtask_gtc_to_vcf",
          type: 0,
          toolLabel: "cnvtask",
          callFunction: "gtc_to_vcf",
          wdlPath: "wdl/tools/mingzi/cnvtask.wdl",
          inputParams: [
            { type: "File", label: "gtc_file" },
            { type: "File", label: "Ref_FilePath" },
            { type: "String", label: "filebase" }
          ],
          outputParams: [
            {
              type: "File",
              label: "gtc_tsv",
              value: '"${filebase}.gtc.tsv"'
            },
            { type: "File", label: "bcf_file", value: '"${filebase}.bcf"' },
            { type: "File", label: "bcf_idx", value: '"${filebase}.bcf.csi"' }
          ],
          imgId: "684c4ab3e6f3469bab31649d80aa969b",
          toolPrivileges: 0,
          createTime: "2023-01-17T08:08:37",
          updateTime: "2023-01-17T08:08:37",
          toolVersion: "",
          userId: "34efa23781bf4aa4baf312bcc5e72e39",
          toolStatus: 1,
          description: "vsf task"
        },
        {
          toolId: "3a5837256e9c4770825a563710093416",
          name: "cnvtaskGTC",
          type: 0,
          toolLabel: "cnvtask",
          callFunction: "idat_to_gtc",
          wdlPath: "wdl/tools/mingzi,cnvtask.wdl/cnvtask.wdl",
          inputParams: [
            { type: "String", label: "run_id" },
            { type: "File", label: "Ref_FilePath" },
            { type: "File", label: "IDAT_File1" },
            { type: "File", label: "IDAT_File2" }
          ],
          outputParams: [
            { type: "File", label: "output_gtc", value: '"gtcs"' }
          ],
          imgId: "684c4ab3e6f3469bab31649d80aa969b",
          toolPrivileges: 0,
          createTime: "2023-01-16T22:05:05",
          updateTime: "2023-01-17T19:12:27",
          toolVersion: "",
          userId: "34efa23781bf4aa4baf312bcc5e72e39",
          toolStatus: 1,
          description: "3222"
        }
      ],
      count: 4,
      currentPage: 1,
      endRecord: 4,
      nextPage: 1,
      pageCount: 1,
      pageSize: 12,
      previousPage: 1
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
