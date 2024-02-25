import torch
import torch.nn as nn
import torch.nn.functional as F

import torchvision.transforms.functional as fn
import numpy as np
from PIL import Image

from torchvision import models

class Network(nn.Module):
    def __init__(self):
        super(Network, self).__init__()
        
        self.fc1 = nn.Linear(512, 120)
        self.act1 = nn.ReLU()
        self.dropout = nn.Dropout(p=0.15)
        self.fc2 = nn.Linear(120, 1)
        self.act2 = nn.Sigmoid()

    def forward(self, x):
        x = self.fc1(x)
        x = self.act1(x)
        x = self.dropout(x)
        x = self.fc2(x)
        x = self.act2(x)
        return x


def runModel():
    global model
    # creates resnet model and replaces the last layer with a fc layer
    model = models.resnet18(weights=models.ResNet18_Weights.DEFAULT, progress=False)
    model_ = Network()
    model.fc = model_

    model.load_state_dict(torch.load('project/model2_50.pt'))
    model.eval()

def formatImg(img_path):
    img = Image.open(img_path)
    # converts img to np and removes transparency values
    img = np.asarray(img, dtype=np.float16)[:,:,:3]
    # converts np to torch and makes the channel value the first one
    img = np.swapaxes(img,0,2)
    img = torch.from_numpy(img).type(torch.float)
    # resizes and crops for resnet
    img = fn.resize(img,size=[224], antialias=True)
    img = fn.center_crop(img,output_size=[224,224])
    img = img/255
    img = img.unsqueeze(0)
    return img

def inference(img_path):
    img = formatImg(img_path)
    out = model(img)
    print(out)
    return out





