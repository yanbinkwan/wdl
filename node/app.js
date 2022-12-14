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
          id: 1998001,
          type: "input",
          label: "input_string",
          params: [],
          inputParams: [],
          outputParams: [
            {
              type: "String",
              label: "Input_Task_Output_Value1"
            }
          ]
        },
        {
          id: 1998001,
          type: "input",
          label: "input_file",
          params: [],
          inputParams: [],
          outputParams: [
            {
              type: "File",
              label: "input"
            }
          ]
        },
        {
          id: 1998002,
          type: "output",
          label: "output_node",
          inputParams: [
            {
              type: "String",
              label: "output"
            }
          ]
        },
        {
          id: 1998007,
          type: "scatter",
          label: "parallel",
          inputParams: [{ label: "input" }],
          outputParams: [{ label: "input" }]
        },
        {
          id: 1998004,
          type: "task",
          label: "Greeting",
          wdl_file: "greeting.wdl",
          call_function: "wf_greeting",
          inputParams: [
            {
              label: "name_input"
            }
          ],
          outputParams: [
            {
              label: "output_name"
            }
          ]
        },
        {
          id: 1998005,
          type: "task",
          label: "ReadBack",
          wdl_file: "read_back.wdl",
          call_function: "wf_read_back",
          inputParams: [
            {
              label: "written_input"
            }
          ],
          outputParams: [
            {
              label: "repeated_output"
            }
          ]
        },
        {
          id: 1998009,
          type: "task",
          label: "cnvtask",
          wdl_file: "cnvtask.wdl",
          call_function: "idat_to_gtc",
          inputParams: [
            {
              label: "run_id",
              type: "String"
            },
            {
              label: "IDAT_File1",
              type: "File"
            },
            {
              label: "IDAT_File2",
              type: "File"
            },
            {
              label: "Ref_FilePath",
              type: "File"
            }
          ],
          outputParams: [
            {
              label: "output_gtc",
              type: "File"
            }
          ]
        },
        {
          id: 1998010,
          type: "task",
          label: "cnvtask",
          wdl_file: "cnvtask.wdl",
          call_function: "gtc_to_vcf",
          inputParams: [
            {
              label: "gtc_file",
              type: "File"
            },
            {
              label: "Ref_FilePath",
              type: "File"
            },
            {
              label: "filebase",
              type: "String"
            }
          ],
          outputParams: [
            {
              label: "gtc_tsv",
              type: "File"
            },
            {
              label: "bcf_file",
              type: "File"
            },
            {
              label: "bcf_idx",
              type: "File"
            }
          ]
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
